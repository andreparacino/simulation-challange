import addIcon from "@/assets/svg/add.svg";
import deleteIcon from "@/assets/svg/delete.svg";
import powerIcon from "@/assets/svg/logo-black.svg";
import plugIcon from "@/assets/svg/plug.svg";
import { DEFAULT_CHARGER_SET_CONFIG } from "@/engine/constants";
import { ChargersSetConfig } from "@/engine/types";

const ChargersSetsEditor = ({
  chargersSetsConfig,
  setChargersSetsConfig
}: {
  chargersSetsConfig: ChargersSetConfig[];
  setChargersSetsConfig: (chargersSetsConfig: ChargersSetConfig[]) => void;
}) => {
  const handleChargerSetConfigChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const newChargersSetsConfig = chargersSetsConfig.map((config, i) =>
      i === index ? { ...config, [name]: parseInt(value) || 0 } : config
    );
    setChargersSetsConfig(newChargersSetsConfig);
  };

  const handleAddChargerSetConfigAtIndex = (index: number) => {
    const newChargersSetsConfig = chargersSetsConfig.slice();
    newChargersSetsConfig.splice(index + 1, 0, DEFAULT_CHARGER_SET_CONFIG);
    setChargersSetsConfig(newChargersSetsConfig);
  };

  const handleDeleteChargerSetConfig = (index: number) => {
    const newChargersSetsConfig = chargersSetsConfig.filter((_, i) => i !== index);
    setChargersSetsConfig(newChargersSetsConfig);
  };

  return (
    <div className="mb-6 flex flex-col gap-5">
      {chargersSetsConfig.map((chargerSet, index) => (
        <div key={index} className="flex flex-col gap-2">
          <span>Charger set #{index + 1}</span>
          <div className="flex w-full items-center gap-3">
            {Object.entries(chargerSet).map(([key, value]) => (
              <div className="flex w-full items-center gap-3" key={key}>
                <label htmlFor={key} className="flex items-center">
                  <img className="w-10" src={key === "output" ? powerIcon : plugIcon} alt="" />
                </label>
                <input
                  type="number"
                  name={key}
                  value={value === 0 ? "" : value}
                  onChange={(e) => handleChargerSetConfigChange(e, index)}
                  min={1}
                  max={200}
                  id={key}
                  aria-describedby="helper-text-explanation"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 invalid:border-pink-500 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              className="ms-3 rounded-lg border border-gray-300 bg-white p-2 font-medium text-gray-900"
              onClick={() => handleAddChargerSetConfigAtIndex(index)}
            >
              <img src={addIcon} className="w-16" alt="" />
            </button>
            {chargersSetsConfig.length > 1 && (
              <button
                type="button"
                className="rounded-lg border border-red-400 bg-red-200 p-2 font-medium text-gray-900"
                onClick={() => handleDeleteChargerSetConfig(index)}
              >
                <img src={deleteIcon} className="w-16" alt="" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChargersSetsEditor;
