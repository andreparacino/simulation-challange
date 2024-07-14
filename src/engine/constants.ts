import {
  ChargerState,
  DistanceDemandProbability,
  SimulationFormData,
  TimeSlotProbabilityMap,
  VehicleArrivalInterval
} from "@/engine/types";
import { createTimeSlotProbabilityMap } from "@/engine/utils";

export const DEFAULT_TOTAL_CHARGERS = 20;
export const DEFAULT_CHARGER_OUTPUT_KW = 11;
export const DEFAULT_CAR_CONSUMPTION_RATE_KWH = 18;
export const DEFAULT_CHARGER_SET_CONFIG = {
  count: DEFAULT_TOTAL_CHARGERS,
  output: DEFAULT_CHARGER_OUTPUT_KW
};

export const SIMULATION_FORM_DATA: SimulationFormData = [
  {
    id: "arrivalProbabilityMultiplier",
    label: "Probability boost (%)",
    value: 100,
    min: 20,
    max: 200
  },
  {
    id: "consumptionRate",
    label: "Cars demand (kWh)",
    value: DEFAULT_CAR_CONSUMPTION_RATE_KWH,
    min: 1,
    max: 100
  }
];

export const INITIAL_CHARGER_STATE: ChargerState = {
  id: undefined,
  chargerOutput: 0,
  isCharging: false,
  chargingEndTime: null,
  totalEnergyConsumedKWh: 0
};

export const VEHICLE_ARRIVAL_INTERVALS: VehicleArrivalInterval[] = [
  { start: 0, end: 759, probability: 0.94 },
  { start: 800, end: 959, probability: 2.83 },
  { start: 1000, end: 1259, probability: 5.66 },
  { start: 1300, end: 1559, probability: 7.55 },
  { start: 1600, end: 1859, probability: 10.38 },
  { start: 1900, end: 2159, probability: 4.72 },
  { start: 2200, end: 2359, probability: 0.94 }
];

export const DISTANCE_DEMAND_PROBABILITIES: DistanceDemandProbability[] = [
  { distance: null, probability: 34.31 },
  { distance: 5, probability: 4.9 },
  { distance: 10, probability: 9.8 },
  { distance: 20, probability: 11.76 },
  { distance: 30, probability: 8.82 },
  { distance: 50, probability: 11.76 },
  { distance: 100, probability: 10.78 },
  { distance: 200, probability: 4.9 },
  { distance: 300, probability: 2.94 }
];

export const TIME_SLOTS: string[] = Array.from({ length: 96 }, (_, index) => {
  const hour = String(Math.floor(index / 4)).padStart(2, "0");
  const minute = String((index % 4) * 15).padStart(2, "0");
  return `${hour}:${minute}`;
});

export const TIME_SLOT_PROBABILITY_MAP: TimeSlotProbabilityMap = createTimeSlotProbabilityMap();
