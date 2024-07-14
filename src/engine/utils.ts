import {
  DISTANCE_DEMAND_PROBABILITIES,
  INITIAL_CHARGER_STATE,
  TIME_SLOT_PROBABILITY_MAP,
  TIME_SLOTS,
  VEHICLE_ARRIVAL_INTERVALS
} from "@/engine/constants";
import {
  ChargersByConsumption,
  ChargersSetConfig,
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

export const getActiveChargersPowerConsumption = (chargers: ChargerState[]) =>
  chargers.reduce(
    (total, charger) => (charger.isCharging ? total + charger.chargerOutput : total),
    0
  );

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

const initializeChargers = (chargerConfigs: ChargersSetConfig[]) => {
  const chargers: ChargerState[] = [];

  chargerConfigs.forEach(({ count, output }) => {
    for (let i = 0; i < count; i++) {
      chargers.push({
        ...INITIAL_CHARGER_STATE,
        id: crypto.randomUUID(),
        chargerOutput: output
      });
    }
  });

  return chargers;
};

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

export const compareConcurrencyFactors = (previous: number, current: number) => {
  const percentageChange = ((current - previous) / previous) * 100;
  const formattedPercentage = percentageChange.toFixed(2);

  if (percentageChange > 0) return `increased by ${formattedPercentage}%`;
  if (percentageChange < 0) return `decreased by ${formattedPercentage}%`;
  return "did not change.";
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
    const chargingDurationMinutes = (energyRequired / charger.chargerOutput) * 60;

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
  chargersSetsConfig,
  arrivalProbabilityMultiplier,
  consumptionRate
}: SimulationConfig): SimulationResults => {
  const chargers = initializeChargers(chargersSetsConfig);

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
        totalEnergyConsumedKWh
      );
    }

    const currentPowerDemand = getActiveChargersPowerConsumption(chargers);
    maxPowerDemand = Math.max(maxPowerDemand, currentPowerDemand);
    yearDetails[day][currentTimeSlot] = currentPowerDemand;

    tickCounter++;
  }

  const theoreticalMaxPowerDemand = chargers.reduce(
    (sum, charger) => sum + charger.chargerOutput,
    0
  );
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
