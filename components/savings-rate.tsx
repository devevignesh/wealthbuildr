import { TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber } from "@/lib/numbers";

interface SavingsRateResult {
  savingsRate: number;
  feedback: React.ReactNode;
}

const calculateSavingsRate = (
  monthlySalary: number,
  monthlyInvestment: number
): SavingsRateResult => {
  const savingsRate =
    Math.round((monthlyInvestment / monthlySalary) * 10000) / 100;
  const feedback: React.ReactNode =
    savingsRate < 50 ? (
      <>
        Your monthly investment of {formatNumber(monthlyInvestment)} represents
        a{" "}
        <span className="text-red-500 font-medium">
          {savingsRate}% <TrendingDown className="inline-flex" />
        </span>{" "}
        savings rate. This is {Math.round((50 - savingsRate) * 100) / 100}%
        lower than the recommended 50-75% for the accumulation phase.
      </>
    ) : (
      <>
        Your monthly investment of {formatNumber(monthlyInvestment)} represents
        a{" "}
        <span className="text-emerald-700">
          {savingsRate}%{" "}
          {savingsRate > 50 && <TrendingUp className="inline-flex" />}
        </span>{" "}
        savings rate, within the recommended 50-75% range for the accumulation
        phase.
      </>
    );

  return { savingsRate, feedback };
};

export default calculateSavingsRate;
