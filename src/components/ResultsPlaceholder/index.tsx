import dataIcon from "@/assets/svg/data.svg";

const ResultsPlaceholder = () => {
  return (
    <div className="flex w-full max-w-5xl flex-1 flex-col items-center gap-3 rounded-xl border border-gray-300 bg-white p-6 md:p-8">
      <div className="w-fit rounded-full bg-green-200 p-3">
        <img className="w-10 rotate-90 opacity-40" src={dataIcon} alt="" />
      </div>
      <h4 className="text-center text-2xl font-bold text-zinc-500">
        The simulation results will be displayed here
      </h4>
    </div>
  );
};

export default ResultsPlaceholder;
