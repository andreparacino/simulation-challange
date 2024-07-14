import { Maybe } from "@/helpers/types";

export type ChargerState = {
  id: string | undefined;
  isCharging: boolean;
  chargingEndTime: Maybe<Date>;
  totalEnergyConsumedKWh: number;
};

export type ChargersByConsumption = {
  low: ChargerState[];
  medium: ChargerState[];
  high: ChargerState[];
};

export type VehicleArrivalInterval = {
  start: number;
  end: number;
  probability: number;
};

export interface DistanceDemandProbability {
  distance: Maybe<number>;
  probability: number;
}

export type TimeSlotProbabilityMap = Map<string, number>;

export type DayDetails = Record<string, number> & {
  totalChargingEvents: number;
};

export type SimulationConfig = {
  chargersAmount: number;
  arrivalProbabilityMultiplier: number;
  consumptionRate: number;
  chargerOutput: number;
};

export type SimulationFormData = {
  id: keyof SimulationConfig;
  label: string;
  value: number;
  min: number;
  max: number;
}[];

export type SimulationResults = {
  chargers: ChargerState[];
  maxPowerDemand: number;
  theoreticalMaxPowerDemand: number;
  totalEnergyConsumedKWh: string;
  concurrencyFactor: number;
  totalChargingEvents: number;
  averageChargingEventsPerMonth: number;
  averageChargingEventsPerWeek: number;
  averageChargingEventsPerDay: number;
  yearDetails: DayDetails[];
};
