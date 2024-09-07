"use client";
import { useMemo, useEffect, useState } from "react";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { IndianRupee, Percent, X, Sparkles } from "lucide-react";
import { AreaChart, DonutChart } from "@tremor/react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SummaryNumber } from "@/components/summary-number";
import SettingsAlert from "@/components/settings-alert";
import { formatNumber, formatNumberForCharts } from "@/lib/numbers";
import { useWealthStore } from "@/providers/wealth-store-provider";
import { calculateWealthData } from "@/lib/calculations";
import { calculateSavingsRate } from "@/components/savings-rate";
import { customTooltip } from "@/components/chart-tooltip";

export default function GrowthPhase() {
  const { age, expense, salary } = useWealthStore(
    state => state.settings
  );
  const targetExpenseToSave = useWealthStore(
    state => state.targetExpenseToSave
  );
  const { monthlyInvestment, interest, goal, wealth } = useWealthStore(
    state => state.growthPhase
  );
  const {
    wealth: totalAccumulatedWealth,
    savingPeriod: accumulationSavingPeriod
  } = useWealthStore(state => state.accumulationPhase);
  const setGrowthPhase = useWealthStore(state => state.setGrowthPhase);
  const monthlySalary = salary / 12; // salary is annual
  const { feedback } = calculateSavingsRate(
    monthlySalary,
    monthlyInvestment,
    "growth"
  );

  const computedData = useMemo(() => {
    const { years, wealthData, totalWealth, months, totalInvested } =
      calculateWealthData(
        expense,
        monthlyInvestment,
        interest,
        goal,
        totalAccumulatedWealth
      );

    const totalReturn = totalWealth - totalInvested;
    const percentageReturn = (totalReturn / totalInvested) * 100;
    const formattedPercentageReturn = percentageReturn.toFixed(2);

    const data = wealthData.map(dataPoint => ({
      year: dataPoint.year,
      wealth: dataPoint.wealth,
      invested: dataPoint.totalInvested
    }));

    const chartData = [
      {
        year: 0,
        wealth: totalAccumulatedWealth,
        invested: totalAccumulatedWealth
      },
      ...wealthData.map(dataPoint => ({
        year: dataPoint.year,
        wealth: dataPoint.wealth,
        invested: dataPoint.totalInvested
      }))
    ];

    return {
      years,
      months,
      data,
      chartData,
      totalWealth,
      totalInvested,
      totalReturn,
      formattedPercentageReturn
    };
  }, [expense, monthlyInvestment, interest, goal, totalAccumulatedWealth]);

  const growthPhaseCompletionAge =
    age + computedData.years + accumulationSavingPeriod;

  const chartData = [
    {
      name: "accumulation",
      wealth: totalAccumulatedWealth
    },
    {
      name: "target",
      wealth: targetExpenseToSave
    },
    {
      name: "growth",
      wealth: wealth
    }
  ];

  useEffect(() => {
    setGrowthPhase({
      wealth: computedData.totalWealth - totalAccumulatedWealth,
      savingPeriod: computedData.years,
      data: computedData.data
    });
  }, [computedData, setGrowthPhase, totalAccumulatedWealth]);

  return (
    <>
      <SettingsAlert />
      <MaxWidthWrapper className="flex flex-col pt-12 pb-16">
        <div className="mb-8">
          <h1 className="order-1 text-2xl font-semibold tracking-tight text-black">
            Growth Phase
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The Growth Phase is the second stage in the journey to financial
            independence. The primary goal in this phase is to grow the
            investments made during the Accumulation Phase until they reach a
            value of 25 times your annual expenses. Although this phase is the
            longest, it&apos;s not necessarily the hardest. In fact, you can
            return to a more balanced lifestyle, easing off the extreme
            frugality of the previous phase.
          </p>
          <div className="relative w-full rounded-lg border px-4 py-3 text-sm text-foreground mt-4 bg-blue-50 border-blue-200">
            <div className="text-sm [&_p]:leading-relaxed">
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                Your Accumulation Phase savings of{" "}
                {formatNumber(totalAccumulatedWealth)} form the foundation of
                your Growth Phase. This amount will continue to grow targeting{" "}
                {goal}x your annual expenses.
              </p>
            </div>
          </div>
        </div>
        <div className="relative w-full rounded-lg border mb-3">
          <div className="rounded-xl bg-white transition-all dark:bg-gray-950 p-4 sm:p-6">
            <div className="lg:justify-between lg:items-end lg:flex">
              <div className="items-end justify-start flex space-x-4">
                <DonutChart
                  index="name"
                  category="wealth"
                  data={chartData}
                  variant="donut"
                  className="w-20 h-20"
                  showTooltip={false}
                  showLabel={false}
                  colors={["#e76e50", "#2a9d90", "#60a8fb"]}
                  showAnimation={true}
                />
                <div>
                  <SummaryNumber
                    className="font-semibold text-lg transition-opacity flex items-center gap-2"
                    from={0}
                    to={computedData?.totalWealth}
                  />
                  <p className="text-sm text-gray-500">
                    Projected Wealth{" "}
                    <span className="text-xs text-gray-500">
                      (by age {growthPhaseCompletionAge})
                    </span>
                  </p>
                </div>
              </div>
              <ul className="lg:grid-cols-3 mt-6 lg:mt-0 gap-[1px] grid-cols-1 grid bg-gray-200">
                <li className="lg:text-right lg:py-0 py-3 px-0 lg:px-4 bg-white">
                  <SummaryNumber
                    className="font-semibold text-gray-900 text-sm"
                    from={0}
                    to={totalAccumulatedWealth}
                  />
                  <div className="space-x-2 flex items-center lg:justify-end">
                    <span className="bg-[#e76e50] w-3 h-3 rounded flex-shrink-0"></span>
                    <p className="text-sm text-gray-500">Accumulation Phase</p>
                  </div>
                </li>
                <li className="lg:text-right lg:py-0 py-3 px-0 lg:px-4 bg-white">
                  <SummaryNumber
                    className="font-semibold text-gray-900 text-sm"
                    from={0}
                    to={wealth}
                  />
                  <div className="space-x-2 flex items-center lg:justify-end">
                    <span className="bg-[#2a9d90] w-3 h-3 rounded flex-shrink-0"></span>
                    <p className="text-sm text-gray-500">Growth Phase</p>
                  </div>
                </li>
                <li className="lg:text-right lg:py-0 py-3 px-0 lg:px-4 bg-white">
                  <SummaryNumber
                    className="font-semibold text-gray-900 text-sm"
                    from={0}
                    to={targetExpenseToSave - computedData?.totalWealth}
                  />
                  <div className="space-x-2 flex items-center lg:justify-end">
                    <span className="bg-[#60a8fb] w-3 h-3 rounded flex-shrink-0"></span>
                    <p className="text-sm text-gray-500">
                      Abundant Phase Target
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="relative rounded-xl bg-white p-5 pt-10 sm:px-6 sm:py-10 border border-gray-200">
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-4 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between w-full max-w-md">
                    <Label className="font-normal text-base">
                      Monthly Investment
                    </Label>
                    <div className="flex items-center">
                      <IndianRupee size={18} />
                      <Input
                        type="number"
                        className="text-right text-lg w-24 border-0 rounded-none border-b-2 appearance-none p-0"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setGrowthPhase({
                            monthlyInvestment: parseInt(e.target.value, 10)
                          })
                        }
                        value={monthlyInvestment}
                      />
                    </div>
                  </div>
                  <Slider
                    defaultValue={[monthlyInvestment]}
                    onValueChange={vals => {
                      setGrowthPhase({ monthlyInvestment: vals[0] });
                    }}
                    max={500000}
                    step={500}
                    className="w-full max-w-md !mt-6"
                    value={[monthlyInvestment]}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between w-full max-w-md">
                    <Label className="font-normal text-base">
                      Savings Target Multiplier
                    </Label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        className="text-right text-lg w-12 border-0 rounded-none border-b-2 appearance-none p-0"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setGrowthPhase({
                            goal: parseInt(e.target.value, 10)
                          })
                        }
                        value={goal}
                      />
                      <X size={18} />
                    </div>
                  </div>
                  <Slider
                    defaultValue={[goal]}
                    onValueChange={vals => {
                      setGrowthPhase({ goal: vals[0] });
                    }}
                    min={1}
                    step={1}
                    max={50}
                    className="w-full max-w-md !mt-6"
                    value={[goal]}
                  />
                  <p className="text-sm text-muted-foreground">
                    This phase recommends that you save and invest a minimum of
                    25 times your annual expenses, which is{" "}
                    {formatNumber(expense * goal, "compact")}.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between w-full max-w-md">
                    <Label className="font-normal text-base">
                      Expected Annual Return Rate
                    </Label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        className="text-right text-lg w-12 border-0 rounded-none border-b-2 appearance-none p-0"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setGrowthPhase({
                            interest: parseInt(e.target.value, 10)
                          })
                        }
                        value={interest}
                      />
                      <Percent size={18} />
                    </div>
                  </div>
                  <Slider
                    defaultValue={[interest]}
                    onValueChange={vals => {
                      setGrowthPhase({ interest: vals[0] });
                    }}
                    min={1}
                    step={1}
                    max={30}
                    className="w-full max-w-md !mt-6"
                    value={[interest]}
                  />
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 lg:gap-8 mt-10 lg:mt-0">
              <AreaChart
                data={computedData?.chartData || []}
                index="year"
                categories={["wealth", "invested"]}
                colors={["#3b82f6", "#06b6d4"]}
                valueFormatter={n => formatNumberForCharts(n)}
                showLegend={false}
                customTooltip={props =>
                  customTooltip({ ...props, phase: "growth" })
                }
                xAxisLabel="Saving period (years)"
                yAxisLabel=" "
                showAnimation={true}
              />
            </div>
          </div>
          <div className="mt-10">
            <div className="flex items-center gap-2 font-heading scroll-m-20 text-xl font-semibold tracking-tight">
              <Sparkles className="w-5 h-5 text-[#CF6073]" /> Investment
              Insights
            </div>
            <ul className="ml-6 list-disc space-y-2 leading-7 [&:not(:first-child)]:mt-6">
              <li>
                <span className="font-medium">Savings Progress</span> - You will
                complete this phase in {computedData?.years} years with a
                monthly {formatNumber(monthlyInvestment)} SIP. By age{" "}
                {growthPhaseCompletionAge}, you will have{" "}
                <span className="text-emerald-700 font-medium">
                  {formatNumber(computedData?.totalWealth)} (
                  {(
                    (computedData?.totalWealth / targetExpenseToSave) *
                    100
                  ).toFixed(1)}
                  %)
                </span>{" "}
                of your target abundant phase goal of{" "}
                {formatNumber(targetExpenseToSave)}, which is 50 times your
                annual expenses.
              </li>
              <li>
                <span className="font-medium ">Investment Growth</span> -{" "}
                Potential capital gains of
                <span className="text-emerald-700 font-medium">
                  {" "}
                  {formatNumber(computedData?.totalReturn)} (
                  {computedData?.formattedPercentageReturn}%)
                </span>{" "}
                from your investment of{" "}
                {formatNumber(computedData?.totalInvested)}.
              </li>
              <li>
                <span className="font-medium ">Savings Rate</span> - {feedback}
              </li>
            </ul>
          </div>
        </div>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          tl;dr
        </h2>
        <ul className="ml-6 list-disc space-y-2 leading-7 [&:not(:first-child)]:mt-6">
          <li>
            <span className="font-medium ">Goal</span> - Grow investments from
            the Accumulation Phase to 25 times your annual expenses.
          </li>
          <li>
            <span className="font-medium ">Lifestyle Adjustment</span> - Ease
            off extreme frugality, but maintain savings 20% for single income,
            up to 50% for dual-income families.
          </li>
          <li>
            <span className="font-medium ">Investments</span> - Let previous
            stock investments grow and start diversifying into other assets like
            real estate.
          </li>
          <li>
            <span className="font-medium ">Home Purchase</span> - Buy a home
            only if you&apos;ve saved 20% for a down payment, using money from
            this phase, not the Accumulation Phase.
          </li>
          <li>
            <span className="font-medium ">Debt Management</span> - Only take on
            a mortgage; avoid any loans with interest rates over 5%.
          </li>
          <li>
            <span className="font-medium ">End Goal</span> - Achieve Financial
            Freedom by reaching 25 times your annual expenses within 12 years.
          </li>
        </ul>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Adjusting to New Responsibilities
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          As life progresses, responsibilities increase, and so do expenses.
          This makes saving more challenging. However, because of the aggressive
          savings and investments made during the Accumulation Phase,
          there&apos;s less pressure to maintain such high savings rates in this
          phase.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          For a single-income household, aiming for a 20% savings rate is a good
          target. In a dual-income household, depending on comfort levels,
          savings can range up to 50%.
        </p>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Letting Investments Grow and Diversifying
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The stock investments made during the Accumulation Phase should be
          left to grow untouched. Meanwhile, the savings from this phase can be
          diversified into other assets, depending on your risk tolerance. One
          such diversification option is Real Estate.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          If you&apos;re considering buying a home, ensure you&apos;ve saved at
          least 20% for a down payment. If you haven&apos;t reached this target,
          it&apos;s a sign you&apos;re not yet ready to make this purchase.
          Importantly, this down payment should come from the savings accrued
          during the Growth Phase not from the nest egg built during the
          Accumulation Phase.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          When purchasing a home, focus on meeting your current needs rather
          than indulging in desires. Don&apos;t buy the biggest house you can
          afford; instead, buy what suits your family size. Larger homes come
          with larger expenses, such as higher insurance premiums, utility
          bills, mortgage payments, property taxes, and maintenance costs.
          It&apos;s essential to evaluate whether these extra costs are worth it
          or if the money would be better invested to further build wealth.
        </p>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Fulfilling Modest Desires
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          This phase also provides the opportunity to fulfill some long-held,
          modest desires, such as purchasing your dream car. However, this
          doesn&apos;t mean splurging on luxury brands like Mercedes-Benz or
          BMW; that level of luxury is reserved for the next phase. For now,
          focus on reliable, affordable cars like the Maruti Swift or Honda City
          in India, or the Honda Accord or Toyota Camry in the USA. These cars
          are known for their reliability, and their insurance and maintenance
          costs are manageable, helping you stay on track with your growth
          goals.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Resist the temptation to stand out with an expensive or unique car
          during this phase. It&apos;s okay to blend in; there will be plenty of
          time to express your individuality in the next phase.
        </p>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Managing Debt Wisely
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          When it comes to debt, the only acceptable form in this phase is a
          mortgage. Avoid any loans with interest rates above 5%, as they can
          hinder your financial growth. The key is to steer clear of any
          unnecessary debt.
        </p>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Achieving Financial Freedom
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Reaching 25 times your annual expenses signifies the attainment of
          Financial Freedom. This milestone marks the end of the Growth Phase
          and sets the stage for the final phase in your wealth-building
          journey.
        </p>
      </MaxWidthWrapper>
    </>
  );
}
