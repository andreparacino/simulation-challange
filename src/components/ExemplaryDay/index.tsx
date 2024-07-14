import { DayDetails } from "@/engine/types";
import { getClassNames } from "@/helpers/utils";

const ExemplaryDay = ({ yearDetails }: { yearDetails: DayDetails[] }) => {
  const exemplaryDay = yearDetails.reduce((acc, day) =>
    day.totalChargingEvents > acc.totalChargingEvents ? day : acc
  );
  const dayIndex = yearDetails.indexOf(exemplaryDay);
  const currentDate = new Date();
  const targetDate = new Date(currentDate.getFullYear(), 0, dayIndex + 1).toLocaleDateString();
  const { totalChargingEvents, ...timeSlotsData } = exemplaryDay;
  const maxDemand = Math.max(...Object.values(timeSlotsData));

  return (
    <div className="flex h-fit w-full max-w-5xl flex-1 flex-col rounded-xl border border-gray-300 bg-white p-6 md:p-8">
      <h4 className="text-2xl font-bold">Exemplary day: {targetDate}</h4>
      <h4 className="mb-5 text-2xl font-bold">Total charging events: {totalChargingEvents}</h4>
      <p className="mb-4">
        Here you will find out how busy each 15 minute interval was. Hover over the bars to check
        the exact power demand at a given interval.
      </p>
      <div className="flex flex-1 flex-col gap-2">
        {Object.entries(timeSlotsData).map(([timeSlot, demand]) => (
          <div className="flex items-center gap-2" key={timeSlot}>
            <span className="text-sm font-bold">{timeSlot}</span>
            <div
              title={demand ? `${demand} kW` : "No demand"}
              key={timeSlot}
              className={getClassNames("h-3 rounded-full opacity-80", getColor(demand, maxDemand))}
              style={{ width: getWidth(demand, maxDemand) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const getColor = (demand: number, maxDemand: number) => {
  const demandRatio = demand / maxDemand;
  if (demandRatio < 0.5) return "bg-green-600";
  if (demandRatio < 0.75) return "bg-yellow-500";
  return "bg-red-600";
};
const getWidth = (demand: number, maxDemand: number) =>
  demand ? `${(100 * demand) / maxDemand}%` : "2%";

export default ExemplaryDay;
