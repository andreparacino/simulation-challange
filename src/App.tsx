import ConsumptionByPeriod from "@/components/ConsumptionByPeriod";
import EnergyConsumptionTable from "@/components/EnergyConsumptionTable";
import ExemplaryDay from "@/components/ExemplaryDay";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import ResultsPlaceholder from "@/components/ResultsPlaceholder";
import SimulationInput from "@/components/SimulationInput";
import { useSimulation } from "@/engine/hooks";
import { SimulationResults } from "@/engine/types";
import { compareConcurrencyFactors, groupByEnergyConsumption } from "@/engine/utils";
import { Maybe } from "@/helpers/types";

const App = () => {
  const { isSimulationRunning, simulationResults, prevConcurrencyFactor, startSimulation } =
    useSimulation();

  console.log("simulationResults", simulationResults);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <Header />
      <section className="flex w-full flex-col items-center gap-6 p-4 py-8 md:p-10">
        <SimulationInput
          isSimulationRunning={isSimulationRunning}
          runSimulation={startSimulation}
        />
        {simulationResults ? (
          <>
            {getResultsHeader(isSimulationRunning, prevConcurrencyFactor, simulationResults)}
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
          </>
        ) : (
          <ResultsPlaceholder />
        )}
      </section>
    </main>
  );
};

const getResultsHeader = (
  isSimulationRunning: boolean,
  prevConcurrencyFactor: Maybe<number>,
  simulationResults: Maybe<SimulationResults>
) => {
  if (isSimulationRunning && prevConcurrencyFactor) return <Loader />;
  if (!prevConcurrencyFactor || !simulationResults) return null;

  return (
    <h4 className="mb-3 text-center text-2xl font-bold">
      Compared to the previous simulation, the concurrency factor{" "}
      {compareConcurrencyFactors(prevConcurrencyFactor, simulationResults.concurrencyFactor)} (from{" "}
      {prevConcurrencyFactor.toFixed(2)} to {simulationResults.concurrencyFactor.toFixed(2)})
    </h4>
  );
};

export default App;
