import ConsumptionByPeriod from "@/components/ConsumptionByPeriod";
import EnergyConsumptionTable from "@/components/EnergyConsumptionTable";
import ExemplaryDay from "@/components/ExemplaryDay";
import Header from "@/components/Header";
import ResultsPlaceholder from "@/components/ResultsPlaceholder";
import SimulationInput from "@/components/SimulationInput";
import { useSimulation } from "@/engine/hooks";
import { groupByEnergyConsumption } from "@/engine/utils";

const App = () => {
  const { isSimulationRunning, simulationResults, startSimulation } = useSimulation();

  console.log(simulationResults);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <Header />
      <section className="flex w-full flex-col items-center gap-6 p-4 py-8 md:p-10">
        <SimulationInput
          isSimulationRunning={isSimulationRunning}
          runSimulation={startSimulation}
        />
        {simulationResults ? (
          <div className="flex max-w-6xl flex-col gap-6">
            <div className="flex w-full flex-col items-center justify-between gap-6 lg:flex-row lg:items-start">
              <EnergyConsumptionTable
                chargersGroups={groupByEnergyConsumption(simulationResults.chargers)}
              />
              <ConsumptionByPeriod
                totalEnergyConsumed={simulationResults.totalEnergyConsumedKWh}
                year={simulationResults.totalChargingEvents}
                month={simulationResults.averageChargingEventsPerMonth}
                week={simulationResults.averageChargingEventsPerWeek}
                day={simulationResults.averageChargingEventsPerDay}
              />
            </div>
            <ExemplaryDay yearDetails={simulationResults.yearDetails} />
          </div>
        ) : (
          <ResultsPlaceholder />
        )}
      </section>
    </main>
  );
};

export default App;
