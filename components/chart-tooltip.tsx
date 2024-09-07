
import { formatNumber } from "@/lib/numbers";

type Phase = "accumulation" | "growth";

type CustomTooltipTypeBar = {
  payload: any;
  active: boolean | undefined;
  label: any;
  phase: Phase;
};

export const customTooltip = (props: CustomTooltipTypeBar) => {
  const { payload, active, phase } = props;
  if (!active || !payload) return null;
  const data = payload[0].payload;
  const years = Math.floor(data.year);
  const months = Math.round((data.year - years) * 10);

  const isInitialInvestment = phase === "growth" && years === 0;

  return (
    <div className="border shadow rounded-md border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
      <div className="flex flex-col space-y-2">
        {isInitialInvestment ? (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-3 rounded bg-[#06b6d4]" />
              <p className="text-gray-700 text-sm">
                Initial Investment: {formatNumber(data.wealth)}
              </p>
            </div>
            <p className="text-gray-500 text-xs">
              Carried over from Accumulation Phase
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-3 rounded bg-[#3b82f6]" />
              <p className="text-gray-700 text-sm">
                Projected wealth: {formatNumber(data.wealth)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-3 rounded bg-[#06b6d4]" />
              <p className="text-gray-700 text-sm">
                Total invested: {formatNumber(data.invested)}
              </p>
            </div>
            <p className="text-gray-500 text-xs">
              After {years} years{months > 0 ? ` and ${months} months` : ""}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
