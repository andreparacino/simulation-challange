import { useState } from "react";

import arrowIcon from "@/assets/svg/arrow.svg";
import { ChargersByConsumption } from "@/engine/types";

const ITEMS_PER_PAGE = 7;

const EnergyConsumptionTable = ({ chargersGroups }: { chargersGroups: ChargersByConsumption }) => {
  const [filter, setFilter] = useState<keyof ChargersByConsumption>("medium");
  const [page, setPage] = useState(1);

  const filteredData = chargersGroups[filter];
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const incrementPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const decrementPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex h-fit w-full flex-1 flex-col gap-6 rounded-xl border border-gray-300 bg-white p-6 md:p-8">
      <h4 className="text-2xl font-bold">Energy Consumption per Charger</h4>
      <div className="flex gap-2">
        {Object.keys(chargersGroups).map((key) => (
          <button
            key={key}
            className={`rounded-full px-4 py-2 font-medium capitalize ${
              filter === key
                ? "bg-gray-800 text-white"
                : "border border-gray-300 bg-gray-100 text-gray-800"
            }`}
            onClick={() => setFilter(key as keyof ChargersByConsumption)}
          >
            {key}
          </button>
        ))}
      </div>
      <table className="text-left text-gray-500 rtl:text-right">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
          <tr>
            <th scope="col" className="px-2 py-3">
              Charger ID
            </th>
            <th scope="col" className="px-2 py-3 text-end">
              Energy Consumed (kWh)
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((obj) => (
            <tr className="border-b bg-white" key={obj.id}>
              <th scope="row" className="px-2 py-4 font-medium text-gray-900">
                {obj.id}
              </th>
              <td className="px-2 py-4 text-end">{obj.totalEnergyConsumedKWh.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            className="rounded-lg border border-gray-300 bg-white p-2 font-medium text-gray-900"
            onClick={decrementPage}
          >
            <img src={arrowIcon} className="w-5 rotate-180" alt="" />
          </button>
          <span>
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            className="rounded-lg border border-gray-300 bg-white p-2 font-medium text-gray-900"
            onClick={incrementPage}
          >
            <img src={arrowIcon} className="w-5" alt="" />
          </button>
        </div>
      )}
    </div>
  );
};

export default EnergyConsumptionTable;
