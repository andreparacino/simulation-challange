interface ConsumptionByPeriodProps {
  totalEnergyConsumed: string;
  year: number;
  month: number;
  week: number;
  day: number;
}

const ConsumptionByPeriod = ({
  totalEnergyConsumed,
  year,
  month,
  week,
  day
}: ConsumptionByPeriodProps) => {
  return (
    <div className="flex h-fit max-w-fit flex-1 flex-col gap-10 rounded-xl border border-gray-300 bg-white p-6 md:w-fit md:p-8">
      <h4 className="text-center text-2xl font-bold">Charging Events per...</h4>

      <div className="grid grid-cols-2 gap-12">
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl font-bold text-gray-600">Year</span>
          <span className="text-xl font-bold ">{year}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl font-bold text-gray-600">Month</span>
          <span className="text-xl font-bold ">{month}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl font-bold text-gray-600">Week</span>
          <span className="text-xl font-bold ">{week}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl font-bold text-gray-600">Day</span>
          <span className="text-xl font-bold ">{day}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-center text-2xl font-bold text-gray-600">Total energy consumed</span>
        <span className="text-center text-xl font-bold">{totalEnergyConsumed} kWh</span>
      </div>
    </div>
  );
};

export default ConsumptionByPeriod;
