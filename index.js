import {
  DEFAULT_CAR_CONSUMPTION_RATE_KWH,
  DEFAULT_CHARGER_OUTPUT_KW,
  DEFAULT_TOTAL_CHARGERS,
  INITIAL_CHARGER_STATE,
  TIME_SLOTS,
} from "./constants.js";
import {
  addMinutes,
  calculateEnergyConsumption,
  getActiveChargersPowerConsumption,
  getVehicleChargingDistance,
  initializeChargers,
  isVehicleArrivalExpected,
  processChargerState,
} from "./utilities.js";
import { calculateStatisticalSummary, calculateTrend } from "./analytics.js";

const runSimulation = ({ chargersAmount, consumptionRate, chargerOutput }) => {
  const chargers = initializeChargers(chargersAmount);

  const TOTAL_TICKS = 35040;
  let tickCounter = 0;
  let maxPowerDemand = 0;
  let totalEnergyConsumedKWh = 0;

  while (tickCounter < TOTAL_TICKS) {
    const currentTimeSlot = TIME_SLOTS[tickCounter % TIME_SLOTS.length];
    const currentDate = addMinutes(
      new Date(new Date().getFullYear(), 0, 1),
      tickCounter * 15
    );

    for (const charger of chargers) {
      totalEnergyConsumedKWh = processChargerState(
        charger,
        currentDate,
        currentTimeSlot,
        consumptionRate,
        chargerOutput,
        totalEnergyConsumedKWh
      );
    }

    const currentPowerDemand = getActiveChargersPowerConsumption(
      chargers,
      chargerOutput
    );
    maxPowerDemand = Math.max(maxPowerDemand, currentPowerDemand);

    tickCounter++;
  }

  const theoreticalMaxPowerDemand = chargersAmount * chargerOutput;
  const concurrencyFactor = (maxPowerDemand / theoreticalMaxPowerDemand) * 100;

  return {
    chargers,
    maxPowerDemand,
    theoreticalMaxPowerDemand,
    totalEnergyConsumedKWh,
    concurrencyFactor,
  };
};

const analyzeConcurrencyFactor = (totalChargers) => {
  const concurrencyFactors = [];

  for (let i = 1; i <= totalChargers; i++) {
    const {
      chargers,
      maxPowerDemand,
      theoreticalMaxPowerDemand,
      totalEnergyConsumedKWh,
      concurrencyFactor,
    } = runSimulation({
      chargersAmount: i,
      consumptionRate: DEFAULT_CAR_CONSUMPTION_RATE_KWH,
      chargerOutput: DEFAULT_CHARGER_OUTPUT_KW,
    });

    concurrencyFactors.push({ chargersCount: i, concurrencyFactor });

    console.log("--------------------");
    console.log(`Simulating charging process with ${i} chargers`);
    console.log(`Peak Power Demand: ${maxPowerDemand} kW`);
    console.log(
      `Total Energy Consumed: ${totalEnergyConsumedKWh.toFixed(2)} kWh`
    );
    console.log(`Max Possible Power Demand: ${theoreticalMaxPowerDemand} kW`);
    console.log(
      `Demand Utilization Percentage: ${concurrencyFactor.toFixed(2)}%`
    );
    console.log("--------------------");
  }

  console.log("--------------------");
  console.log("--------------------");
  console.log("Trend analysis of the simulation:");
  console.log(calculateTrend(concurrencyFactors));
  console.log("Statical summary of the simulation:");
  console.log(calculateStatisticalSummary(concurrencyFactors));
};

analyzeConcurrencyFactor(DEFAULT_TOTAL_CHARGERS);
