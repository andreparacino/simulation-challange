import { useEffect, useState } from "react";

import { SimulationConfig, SimulationResults } from "@/engine/types";
import { Maybe } from "@/helpers/types";

export const useSimulation = () => {
  const [isPending, setIsPending] = useState(false);
  const [results, setResults] = useState<Maybe<SimulationResults>>(null);
  const [worker, setWorker] = useState<Maybe<Worker>>(null);

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

  const start = (simulationConfig: SimulationConfig) => {
    setIsPending(true);
    worker?.postMessage(simulationConfig);
  };

  return {
    isSimulationRunning: isPending,
    simulationResults: results,
    startSimulation: start
  };
};
