"use client";
import { useMemo, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { AreaChart, BarChart } from "@tremor/react";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import SettingsAlert from "@/components/settings-alert";
import { useWealthStore } from "@/providers/wealth-store-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { formatNumber, formatNumberForCharts } from "@/lib/numbers";

type CustomTooltipTypeBar = {
  payload: any;
  active: boolean | undefined;
  label: any;
};

interface WealthDataPoint {
  year: number;
  wealth: number;
  targetWealth: number;
}

function roundUpToNearestYear(years: number, months: number): number {
  return Math.ceil(years + months / 10);
}

const customTooltip = (props: CustomTooltipTypeBar) => {
  const { payload, active } = props;
  if (!active || !payload) return null;

  const data = payload[0].payload;
  const years = Math.floor(data.year);
  const months = Math.round((data.year - years) * 10);

  return (
    <div className="border shadow rounded-md border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
      {payload.map((category: any, idx: any) => (
        <div key={idx} className="flex items-center space-x-2.5">
          <div className="w-1 h-3 bg-[#6277cd] rounded" />
          <div className="space-y-1">
            <p className="text-gray-700 text-sm">
              Projected wealth after {years} years
              {months > 0 ? ` and ${months} months` : ""}:{" "}
              {formatNumber(category.value)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
const customTooltipLineChart = (props: CustomTooltipTypeBar) => {
  const { payload, active } = props;
  if (!active || !payload) return null;

  const data = payload[0].payload;
  const years = Math.floor(data.year);
  const months = Math.round((data.year - years) * 10);

  if (years === 0) {
    return (
      <div className="border shadow rounded-md border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-3 rounded bg-[#06b6d4]" />
            <p className="text-gray-700 text-sm">
              Initial Investment: {formatNumber(data.wealth)}
            </p>
          </div>
          <p className="text-gray-500 text-xs">
            Carried over from Accumulation and Growth Phases
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border shadow rounded-md border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown space-y-2">
      {payload.map((category: any, idx: any) => {
        if (category.dataKey === "wealth") {
          return (
            <div key={idx} className="flex items-center space-x-2.5">
              <div className=" w-1 h-3 bg-[#06b6d4] rounded" />
              <div className="space-y-1">
                <p className="text-gray-700 text-sm">
                  Projected wealth after {years} years
                  {months > 0 ? ` and ${months} months` : ""}:{" "}
                  {formatNumber(category.value)}
                </p>
              </div>
            </div>
          );
        } else {
          return (
            <div key={idx} className="flex items-center space-x-2.5">
              <div className="w-1 h-3 bg-[#3b82f6] rounded" />
              <div className="space-y-1">
                <p className="text-gray-700 text-sm">
                  Target wealth: {formatNumber(category.value)}
                </p>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

function calculateYearsToTargetNetWorth(
  combinedNetWorth: number,
  targetNetWorth: number,
  annualGrowthRate: number
): {
  years: number;
  months: number;
  wealthData: WealthDataPoint[];
  finalWealth: number;
} {
  let currentWealth = combinedNetWorth;
  let years = 0;
  const wealthData: WealthDataPoint[] = [];
  const annualRate = 1 + annualGrowthRate / 100;

  while (currentWealth < targetNetWorth) {
    currentWealth *= annualRate;
    years++;

    wealthData.push({
      year: years,
      wealth: Math.round(currentWealth),
      targetWealth: targetNetWorth
    });
  }

  // Calculate months for reference (not used in calculations)
  const remainingMonths = Math.round(
    (currentWealth - targetNetWorth) / (currentWealth / 12)
  );

  return {
    years,
    months: remainingMonths,
    wealthData,
    finalWealth: Math.round(currentWealth)
  };
}

export default function AbundantPhase() {
  const { combinedData, combinedNetWorth, abundantPhaseAge } = useWealthStore(
    state => state.abundantPhase
  );
  const targetNetWorth = useWealthStore(
    state => state.settings.targetExpenseToSave
  );
  const setAbundantPhase = useWealthStore(state => state.setAbundantPhase);
  const annualGrowthRate = 12;
  const computedData = useMemo(() => {
    const { years, wealthData, finalWealth, months } =
      calculateYearsToTargetNetWorth(
        combinedNetWorth,
        targetNetWorth,
        annualGrowthRate
      );

    const totalReturn = finalWealth - combinedNetWorth;
    const percentageReturn = (totalReturn / combinedNetWorth) * 100;
    const formattedPercentageReturn = percentageReturn.toFixed(2);
    const roundedSavingPeriod = roundUpToNearestYear(years, months);

    const chartDataWithInitialData = [
      {
        year: 0,
        wealth: combinedNetWorth,
        targetWealth: targetNetWorth
      },
      ...wealthData.map(dataPoint => ({
        year: dataPoint.year,
        wealth: dataPoint.wealth,
        targetWealth: targetNetWorth
      }))
    ];

    const data = [
      ...wealthData.map(dataPoint => ({
        year: dataPoint.year,
        wealth: dataPoint.wealth,
        targetWealth: targetNetWorth
      }))
    ];

    return {
      years,
      data: wealthData,
      chartData: data,
      chartDataWithInitialData,
      totalWealth: finalWealth,
      totalReturn,
      formattedPercentageReturn,
      roundedSavingPeriod,
      months
    };
  }, [combinedNetWorth, targetNetWorth, annualGrowthRate]);

  useEffect(() => {
    setAbundantPhase({
      wealth: computedData.totalWealth,
      data: computedData.chartData
    });
  }, [setAbundantPhase, computedData]);

  return (
    <>
      <SettingsAlert />
      <MaxWidthWrapper className="flex flex-col pt-12 pb-16">
        <div className="mb-8">
          <h1 className="order-1 text-2xl font-semibold tracking-tight text-black">
            Abundant Phase
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The Abundant Phase is the final stage of wealth-building, where you
            reach 50 times your annual expenses. With a solid financial
            foundation, you can enjoy luxury without working, but staying active
            and engaged is key. This phase often shifts focus from personal
            wealth to community impact, turning your success into a broader
            legacy. By thinking long-term and using strategies like the
            &quot;Rule of 72,&quot; reaching millions or even billions is
            achievable. Dedication and smart investing make this ambitious goal
            possible.
          </p>
          <div className="relative w-full rounded-lg border px-4 py-3 text-sm text-foreground mt-4 bg-amber-50 border-amber-200">
            <div className="text-sm [&_p]:leading-relaxed">
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                Your Accumulation Phase and Growth Phase savings of{" "}
                {formatNumber(combinedNetWorth)} form the foundation of your
                Abundant Phase. This amount will continue to grow targeting 50x
                your annual expenses.
              </p>
            </div>
          </div>
        </div>
        <div className="relative rounded-xl bg-white p-5 pt-10 sm:px-6 sm:py-10 border border-gray-200 mb-3">
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-4 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 font-heading scroll-m-20 text-lg font-semibold tracking-tight">
                  <Sparkles className="w-5 h-5 text-[#CF6073]" /> Abundant Phase
                  Insights
                </div>
                <ul className="ml-6 list-disc space-y-2 leading-7 [&:not(:first-child)]:mt-6">
                  <li>
                    <span className="font-medium">Growth</span> - If your annual
                    growth rate {annualGrowthRate}% is maintained, it took only{" "}
                    {computedData?.years} years to reach your target net worth.
                  </li>
                  <li>
                    <span className="font-medium">Savings Progress</span> - At
                    age {abundantPhaseAge + computedData?.roundedSavingPeriod},
                    you will have{" "}
                    <span className="text-emerald-700 font-medium">
                      {formatNumber(computedData?.totalWealth)} (
                      {(
                        (computedData?.totalWealth / targetNetWorth) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>{" "}
                    of your target abundant phase goal of{" "}
                    {formatNumber(targetNetWorth)}.
                  </li>
                  <li>
                    <span className="font-medium ">Investment Growth</span> -{" "}
                    Potential capital gains of
                    <span className="text-emerald-700 font-medium">
                      {" "}
                      {formatNumber(computedData?.totalReturn)} (
                      {computedData?.formattedPercentageReturn}%)
                    </span>{" "}
                    from your investments of {formatNumber(combinedNetWorth)}.
                  </li>
                </ul>
              </div>
            </div>
            <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 lg:gap-8 mt-10 lg:mt-0">
              <AreaChart
                data={computedData?.chartDataWithInitialData || []}
                index="year"
                categories={["wealth", "targetWealth"]}
                colors={["#06b6d4", "#3b82f6"]}
                valueFormatter={n => formatNumber(n, "compact")}
                showLegend={false}
                showGridLines={true}
                showYAxis={false}
                className="h-48"
                customTooltip={customTooltipLineChart}
                showAnimation={true}
                xAxisLabel="Growth Period (years)"
              />
            </div>
          </div>
        </div>
        <div>
          <Card className="flex flex-col rounded-xl">
            <CardHeader className="items-center mb-6">
              <CardTitle>Your Investment Journey</CardTitle>
              <CardDescription>
                This chart shows your investment journey for all phases
                combined.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <BarChart
                data={combinedData || []}
                index="year"
                categories={["wealth"]}
                colors={["#6277cd"]}
                valueFormatter={n => formatNumberForCharts(n)}
                showLegend={false}
                customTooltip={customTooltip}
                xAxisLabel="Saving period (years)"
                yAxisLabel=" "
              />
            </CardContent>
          </Card>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
