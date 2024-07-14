import {
  DISTANCE_DEMAND_PROBABILITIES,
  INITIAL_CHARGER_STATE,
  TIME_SLOT_PROBABILITY_MAP,
  TIME_SLOTS,
  VEHICLE_ARRIVAL_INTERVALS
} from "@/engine/constants";
import {
  ChargersByConsumption,
  ChargerState,
  DayDetails,
  SimulationConfig,
  SimulationResults,
  TimeSlotProbabilityMap
} from "@/engine/types";

export const isVehicleArrivalExpected = (timeSlot: string, multiplier: number) => {
  const baseProbability = TIME_SLOT_PROBABILITY_MAP.get(timeSlot) || 0;
  return Math.random() * 100 < baseProbability * (multiplier / 100);
};

export const addMinutes = (date: Date, minutes: number) =>
  new Date(date.getTime() + minutes * 60000);

export const getVehicleChargingDistance = () => {
  const randomValue = Math.random() * 100;
  let cumulativeProbability = 0;

  for (const { distance, probability } of DISTANCE_DEMAND_PROBABILITIES) {
    cumulativeProbability += probability;
    if (randomValue <= cumulativeProbability) {
      return distance;
    }
  }

  return null;
};

export const calculateEnergyConsumption = (distance: number, consumptionRate: number) =>
  (distance / 100) * consumptionRate;

export const getActiveChargersPowerConsumption = (
  chargers: ChargerState[],
  chargerOutput: number
) => chargers.reduce((total, { isCharging }) => (isCharging ? total + chargerOutput : total), 0);

// Using `function` instead of `const` to avoid hoisting issues (in constants.ts)
export function createTimeSlotProbabilityMap(): TimeSlotProbabilityMap {
  return new Map(
    TIME_SLOTS.map((timeSlot) => {
      const timeInMinutes = parseInt(timeSlot.replace(":", ""), 10);
      const interval = VEHICLE_ARRIVAL_INTERVALS.find(
        ({ start, end }) => timeInMinutes >= start && timeInMinutes < end
      );
      return [timeSlot, interval ? interval.probability : 0];
    })
  );
}

const initializeChargers = (chargersAmount: number): ChargerState[] =>
  Array.from({ length: chargersAmount }, () => ({
    ...INITIAL_CHARGER_STATE,
    id: crypto.randomUUID()
  }));

export const groupByEnergyConsumption = (chargers: ChargerState[]): ChargersByConsumption => {
  const energyValues = chargers.map((obj) => obj.totalEnergyConsumedKWh).sort((a, b) => a - b);

  const len = energyValues.length;
  const lowThreshold = energyValues[Math.floor(len / 3)];
  const highThreshold = energyValues[Math.floor((2 * len) / 3)];

  const low: ChargerState[] = [];
  const medium: ChargerState[] = [];
  const high: ChargerState[] = [];

  for (const obj of chargers) {
    if (obj.totalEnergyConsumedKWh < lowThreshold) {
      low.push(obj);
    } else if (obj.totalEnergyConsumedKWh < highThreshold) {
      medium.push(obj);
    } else {
      high.push(obj);
    }
  }

  return { low, medium, high };
};

const createDayDetails = () => {
  const dailyObject = {} as DayDetails;

  TIME_SLOTS.forEach((timeSlot) => {
    dailyObject[timeSlot] = 0;
  });
  dailyObject.totalChargingEvents = 0;

  return dailyObject;
};

const generateYearDetails = () => {
  const daysInYear = 365;
  const yearDetails: DayDetails[] = [];

  for (let day = 0; day < daysInYear; day++) {
    yearDetails.push(createDayDetails());
  }

  return yearDetails;
};

const processChargerState = (
  charger: ChargerState,
  currentDate: Date,
  currentTimeSlot: string,
  month: number,
  day: number,
  chargingEventsPerMonth: number[],
  yearDetails: DayDetails[],
  arrivalProbabilityMultiplier: number,
  consumptionRate: number,
  chargerOutput: number,
  totalEnergyConsumedKWh: number
) => {
  if (charger.isCharging && charger.chargingEndTime) {
    if (currentDate < charger.chargingEndTime) return totalEnergyConsumedKWh;

    charger.isCharging = false;
    charger.chargingEndTime = null;
  } else if (isVehicleArrivalExpected(currentTimeSlot, arrivalProbabilityMultiplier)) {
    const distance = getVehicleChargingDistance();

    if (distance === null) return totalEnergyConsumedKWh;

    const energyRequired = calculateEnergyConsumption(distance, consumptionRate);
    const chargingDurationMinutes = (energyRequired / chargerOutput) * 60;

    charger.totalEnergyConsumedKWh += energyRequired;
    totalEnergyConsumedKWh += energyRequired;
    charger.isCharging = true;
    charger.chargingEndTime = addMinutes(currentDate, chargingDurationMinutes);

    chargingEventsPerMonth[month]++;
    yearDetails[day].totalChargingEvents++;
  }
  return totalEnergyConsumedKWh;
};

export const runSimulation = ({
  chargersAmount,
  arrivalProbabilityMultiplier,
  consumptionRate,
  chargerOutput
}: SimulationConfig): SimulationResults => {
  const chargers = initializeChargers(chargersAmount);

  const TOTAL_TICKS = 35040;
  let tickCounter = 0;
  let maxPowerDemand = 0;
  let totalEnergyConsumedKWh = 0;
  const chargingEventsPerMonth = Array(12).fill(0);
  const yearDetails = generateYearDetails();

  while (tickCounter < TOTAL_TICKS) {
    const currentTimeSlot = TIME_SLOTS[tickCounter % TIME_SLOTS.length];
    const currentDate = addMinutes(new Date(new Date().getFullYear(), 0, 1), tickCounter * 15);
    const month = currentDate.getMonth();
    const day = Math.floor(tickCounter / 96);

    for (const charger of chargers) {
      totalEnergyConsumedKWh = processChargerState(
        charger,
        currentDate,
        currentTimeSlot,
        month,
        day,
        chargingEventsPerMonth,
        yearDetails,
        arrivalProbabilityMultiplier,
        consumptionRate,
        chargerOutput,
        totalEnergyConsumedKWh
      );
    }

    const currentPowerDemand = getActiveChargersPowerConsumption(chargers, chargerOutput);
    maxPowerDemand = Math.max(maxPowerDemand, currentPowerDemand);
    yearDetails[day][currentTimeSlot] = currentPowerDemand;

    tickCounter++;
  }

  const theoreticalMaxPowerDemand = chargersAmount * chargerOutput;
  const concurrencyFactor = (maxPowerDemand / theoreticalMaxPowerDemand) * 100;
  const totalChargingEvents = chargingEventsPerMonth.reduce((a, b) => a + b, 0);
  const [averageChargingEventsPerMonth, averageChargingEventsPerWeek, averageChargingEventsPerDay] =
    [totalChargingEvents / 12, totalChargingEvents / 52, totalChargingEvents / 365].map(Math.round);

  return {
    chargers,
    maxPowerDemand,
    theoreticalMaxPowerDemand,
    totalEnergyConsumedKWh: totalEnergyConsumedKWh.toFixed(2),
    concurrencyFactor,
    totalChargingEvents,
    averageChargingEventsPerMonth,
    averageChargingEventsPerWeek,
    averageChargingEventsPerDay,
    yearDetails
  };
};
