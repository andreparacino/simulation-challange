import { createTimeSlotProbabilityMap } from "./utilities.js";

export const DEFAULT_TOTAL_CHARGERS = 30;
export const DEFAULT_CHARGER_OUTPUT_KW = 11;
export const DEFAULT_CAR_CONSUMPTION_RATE_KWH = 18;

export const INITIAL_CHARGER_STATE = {
  id: undefined,
  isCharging: false,
  chargingEndTime: null,
};

export const VEHICLE_ARRIVAL_INTERVALS = [
  { start: 0, end: 759, probability: 0.94 },
  { start: 800, end: 959, probability: 2.83 },
  { start: 1000, end: 1259, probability: 5.66 },
  { start: 1300, end: 1559, probability: 7.55 },
  { start: 1600, end: 1859, probability: 10.38 },
  { start: 1900, end: 2159, probability: 4.72 },
  { start: 2200, end: 2359, probability: 0.94 },
];

export const DISTANCE_DEMAND_PROBABILITIES = [
  { distance: null, probability: 34.31 },
  { distance: 5, probability: 4.9 },
  { distance: 10, probability: 9.8 },
  { distance: 20, probability: 11.76 },
  { distance: 30, probability: 8.82 },
  { distance: 50, probability: 11.76 },
  { distance: 100, probability: 10.78 },
  { distance: 200, probability: 4.9 },
  { distance: 300, probability: 2.94 },
];

export const TIME_SLOTS = Array.from({ length: 96 }, (_, index) => {
  const hour = String(Math.floor(index / 4)).padStart(2, "0");
  const minute = String((index % 4) * 15).padStart(2, "0");
  return `${hour}:${minute}`;
});

export const TIME_SLOT_PROBABILITY_MAP = createTimeSlotProbabilityMap();
