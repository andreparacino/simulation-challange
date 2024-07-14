import { useEffect, useState } from "react";

import { SimulationConfig, SimulationResults } from "@/engine/types";
import { Maybe } from "@/helpers/types";

export const useSimulation = () => {
  const [isPending, setIsPending] = useState(false);
  const [results, setResults] = useState<Maybe<SimulationResults>>(null);
  const [worker, setWorker] = useState<Maybe<Worker>>(null);
  const [prevData, setPrevData] = useState<{
    config: Maybe<SimulationConfig>;
    concurrencyFactor: Maybe<number>;
  }>({
    config: null,
    concurrencyFactor: null
  });

  useEffect(() => {
    const newWorker = new Worker("./src/engine/worker.ts", { type: "module" });
    newWorker.onmessage = (e: MessageEvent<SimulationResults>) => {
      setResults(e.data);
      setIsPending(false);
    };
    setWorker(newWorker);

    return () => {
      newWorker.terminate();
    };
  }, []);

  const handleConfigChanges = (simulationConfig: SimulationConfig) => {
    const isConfigEqualToPrev =
      JSON.stringify(prevData?.config) === JSON.stringify(simulationConfig);

    setPrevData((prev) => {
      if (isConfigEqualToPrev) {
        return { ...prev, concurrencyFactor: null };
      }
      if (results && prev.config && !isConfigEqualToPrev) {
        return {
          config: simulationConfig,
          concurrencyFactor: results.concurrencyFactor
        };
      }
      return { ...prev, config: simulationConfig };
    });
  };

  const start = (simulationConfig: SimulationConfig) => {
    handleConfigChanges(simulationConfig);

    setIsPending(true);
    worker?.postMessage(simulationConfig);
  };

  return {
    isSimulationRunning: isPending,
    simulationResults: results,
    prevConcurrencyFactor: prevData?.concurrencyFactor,
    startSimulation: start
  };
};
