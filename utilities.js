import {
  DISTANCE_DEMAND_PROBABILITIES,
  INITIAL_CHARGER_STATE,
  TIME_SLOTS,
  TIME_SLOT_PROBABILITY_MAP,
  VEHICLE_ARRIVAL_INTERVALS,
} from "./constants.js";

export const isVehicleArrivalExpected = (timeSlot) => {
  const probability = TIME_SLOT_PROBABILITY_MAP.get(timeSlot);
  return Math.random() * 100 < probability;
};

export const addMinutes = (date, minutes) =>
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

export const calculateEnergyConsumption = (distance, consumptionRate) =>
  (distance / 100) * consumptionRate;

export const getActiveChargersPowerConsumption = (chargers, chargerOutput) =>
  chargers.reduce(
    (total, { isCharging }) => (isCharging ? total + chargerOutput : total),
    0
  );

export const createTimeSlotProbabilityMap = () =>
  new Map(
    TIME_SLOTS.map((timeSlot) => {
      const timeInMinutes = parseInt(timeSlot.replace(":", ""), 10);
      const interval = VEHICLE_ARRIVAL_INTERVALS.find(
        ({ start, end }) => timeInMinutes >= start && timeInMinutes < end
      );
      return [timeSlot, interval ? interval.probability : 0];
    })
  );

export const initializeChargers = (chargersAmount) =>
  Array.from({ length: chargersAmount }, (_, index) => ({
    ...INITIAL_CHARGER_STATE,
    id: index,
  }));

export const processChargerState = (
  charger,
  currentDate,
  currentTimeSlot,
  consumptionRate,
  chargerOutput,
  totalEnergyConsumedKWh
) => {
  if (charger.isCharging && charger.chargingEndTime) {
    if (currentDate < charger.chargingEndTime) return totalEnergyConsumedKWh;

    charger.isCharging = false;
    charger.chargingEndTime = null;
  } else if (isVehicleArrivalExpected(currentTimeSlot)) {
    const distance = getVehicleChargingDistance();
    if (distance === null) return totalEnergyConsumedKWh;

    const energyRequired = calculateEnergyConsumption(
      distance,
      consumptionRate
    );
    const chargingDurationMinutes = (energyRequired / chargerOutput) * 60;

    totalEnergyConsumedKWh += energyRequired;
    charger.isCharging = true;
    charger.chargingEndTime = addMinutes(currentDate, chargingDurationMinutes);
  }
  return totalEnergyConsumedKWh;
};
