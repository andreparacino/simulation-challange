import { SimulationConfig } from "@/engine/types";
import { runSimulation } from "@/engine/utils";

self.onmessage = (e: MessageEvent<SimulationConfig>) => {
  const result = runSimulation(e.data);
  self.postMessage(result);
};
