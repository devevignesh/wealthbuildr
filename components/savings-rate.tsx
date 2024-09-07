import { TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber } from "@/lib/numbers";

type Phase = "accumulation" | "growth";
interface PhaseConfig {
  minRate: number;
  maxRate: number;
}
interface SavingsRateResult {
  savingsRate: number;
  feedback: React.ReactNode;
}

const phaseConfigs: Record<Phase, PhaseConfig> = {
  accumulation: { minRate: 50, maxRate: 75 },
  growth: { minRate: 20, maxRate: 20 }
};

export const calculateSavingsRate = (
  monthlySalary: number,
  monthlyInvestment: number,
  phase: Phase
): SavingsRateResult => {
  const savingsRate =
    Math.round((monthlyInvestment / monthlySalary) * 10000) / 100;
  const { minRate, maxRate } = phaseConfigs[phase];

  const feedback: React.ReactNode =
    savingsRate < minRate ? (
      <>
        Your monthly investment of {formatNumber(monthlyInvestment)} represents
        a{" "}
        <span className="text-red-500 font-medium">
          {savingsRate}% <TrendingDown className="inline-flex" />
        </span>{" "}
        savings rate. This is {Math.round((minRate - savingsRate) * 100) / 100}%
        lower than the recommended {phase === "accumulation"
          ? `${minRate}-${maxRate}%`
          : maxRate + "%"}{" "}
        for the {phase} phase.
      </>
    ) : (
      <>
        Your monthly investment of {formatNumber(monthlyInvestment)} represents
        a{" "}
        <span className="text-emerald-700">
          {savingsRate}%{" "}
          {savingsRate > minRate && <TrendingUp className="inline-flex" />}
        </span>{" "}
        savings rate, within the recommended {phase === "accumulation"
          ? `${minRate}-${maxRate}%`
          : maxRate + "%"}{" "}
        for the {phase} phase.
      </>
    );

  return { savingsRate, feedback };
};
