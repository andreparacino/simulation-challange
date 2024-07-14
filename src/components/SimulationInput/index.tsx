import { useState } from "react";

import Loader from "@/components/Loader";
import { SIMULATION_FORM_DATA } from "@/engine/constants";
import { SimulationConfig, SimulationFormData } from "@/engine/types";
import { getClassNames } from "@/helpers/utils";

import styles from "./index.module.scss";

const SimulationInput = ({
  runSimulation,
  isSimulationRunning
}: {
  runSimulation: (simulationConfig: SimulationConfig) => void;
  isSimulationRunning: boolean;
}) => {
  const [configuration, setConfiguration] = useState<SimulationFormData>(SIMULATION_FORM_DATA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newConfiguration = configuration.map((config) =>
      config.id === name ? { ...config, value: parseInt(value) || 0 } : config
    );
    setConfiguration(newConfiguration);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSimulation(
      configuration.reduce(
        (acc, config) => ({ ...acc, [config.id]: config.value }),
        {} as SimulationConfig
      )
    );
  };

  return (
    <section
      className={getClassNames(
        styles.SimulationInput,
        "mb-10 flex w-full flex-col items-center justify-evenly gap-10 overflow-x-hidden md:px-5 lg:flex-row"
      )}
    >
      <div
        className={getClassNames(
          styles["SimulationInput-heroImage"],
          "relative my-6 h-52 w-52 rounded-full lg:my-0 lg:block"
        )}
      />
      <div className="h-fit max-w-fit flex-1 rounded-xl border border-gray-300 bg-white p-6 md:w-fit md:p-8">
        <h4 className="mb-3 text-center text-2xl font-bold">Check this out!</h4>
        <p className="mb-6 max-w-lg hyphens-auto text-center font-normal text-gray-500">
          Choose to your liking the configuration of the simulation and see the results in real
          time.
        </p>
        <form className="mx-auto grid max-w-sm" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            {configuration.map((config) => (
              <div className="group relative z-0 w-full" key={config.id}>
                <label
                  title={`Min: ${config.min}, Max: ${config.max}`}
                  htmlFor={config.id}
                  className="mb-1 block text-gray-900"
                >
                  {config.label}
                </label>
                <input
                  type="number"
                  name={config.id}
                  value={config.value === 0 ? "" : config.value}
                  onChange={handleChange}
                  min={config.min}
                  max={config.max}
                  id={config.id}
                  aria-describedby="helper-text-explanation"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 invalid:border-pink-500 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            {isSimulationRunning && <Loader />}
            <button
              disabled={isSimulationRunning}
              type="submit"
              className="rounded-lg bg-gray-800 px-5 py-2.5 text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Run simulation
            </button>
          </div>
        </form>
      </div>
      <div
        className={getClassNames(
          styles["SimulationInput-heroImage"],
          "relative hidden h-52 w-52 rounded-full lg:block"
        )}
      />
    </section>
  );
};

export default SimulationInput;
