import {
  DEFAULT_CHARGER_OUTPUT_KW,
  TIME_SLOTS,
  DEFAULT_TOTAL_CHARGERS,
  DEFAULT_CAR_CONSUMPTION_RATE_KWH,
} from "./constants.js";
import {
  addMinutes,
  getActiveChargersPowerConsumption,
  initializeChargers,
  processChargerState,
} from "./utilities.js";

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

const {
  chargers,
  maxPowerDemand,
  theoreticalMaxPowerDemand,
  totalEnergyConsumedKWh,
  concurrencyFactor,
} = runSimulation({
  chargersAmount: DEFAULT_TOTAL_CHARGERS,
  consumptionRate: DEFAULT_CAR_CONSUMPTION_RATE_KWH,
  chargerOutput: DEFAULT_CHARGER_OUTPUT_KW,
});

console.log(`Max power demand: ${maxPowerDemand} kW`);
console.log(`Theoretical max power demand: ${theoreticalMaxPowerDemand} kW`);
console.log(`Total energy consumed: ${totalEnergyConsumedKWh.toFixed(2)} kWh`);
console.log(`Concurrency factor: ${concurrencyFactor.toFixed(2)}%`);
