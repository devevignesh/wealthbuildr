"use client";
import { useMemo, useEffect } from "react";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import {
  IndianRupee,
  Percent,
  X,
  Sparkles,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { DonutChart, AreaChart } from "@tremor/react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SummaryNumber } from "@/components/summary-number";
import SettingsAlert from "@/components/settings-alert";
import { Switch } from "@/components/ui/switch";
import { formatNumber } from "@/lib/numbers";
import { useStore } from "@/lib/store";
interface WealthDataPoint {
  year: number;
  wealth: number;
  wealthWithoutInflation: number;
  totalInvested: number;
}
interface SavingsRateResult {
  savingsRate: number;
  feedback: React.ReactNode;
}

function calculateInvestmentYearsWithWealthData(
  expense: number,
  monthlyInvestment: number,
  annualReturnRate: number,
  goal: number,
  inflation: number
): {
  years: number;
  months: number;
  wealthData: WealthDataPoint[];
  totalWealth: number;
  totalWealthWithoutInflation: number;
  totalInvested: number;
} {
  const wealthData: WealthDataPoint[] = [];
  let totalWealth = 0;
  let totalWealthWithoutInflation = 0;
  let totalInvested = 0;
  let years = 0;
  const monthlyRate = annualReturnRate / 12 / 100;
  let targetAmount = expense * goal;
  let adjustedMonthlyInvestment = monthlyInvestment;

  while (totalWealth < targetAmount) {
    for (let month = 0; month < 12; month++) {
      totalWealth =
        (totalWealth + adjustedMonthlyInvestment) * (1 + monthlyRate);
      totalWealthWithoutInflation =
        (totalWealthWithoutInflation + monthlyInvestment) * (1 + monthlyRate);
      totalInvested += adjustedMonthlyInvestment;
    }

    years++;
    // Adjust target amount and annual investment for inflation
    targetAmount *= 1 + inflation / 100;
    adjustedMonthlyInvestment *= 1 + inflation / 100;

    const roundedWealth = Math.round(totalWealth);
    const roundedWealthWithoutInflation = Math.round(
      totalWealthWithoutInflation
    );
    const roundedTotalInvested = Math.round(totalInvested);
    wealthData.push({
      year: years,
      wealth: roundedWealth,
      wealthWithoutInflation: roundedWealthWithoutInflation,
      totalInvested: roundedTotalInvested
    });
  }

  // Calculate months for reference (not used in calculations)
  const remainingMonths = Math.round(
    (totalWealth - targetAmount) / (totalWealth / 12)
  );

  return {
    years,
    months: remainingMonths,
    wealthData,
    totalWealth: Math.round(totalWealth),
    totalWealthWithoutInflation: Math.round(totalWealthWithoutInflation),
    totalInvested: Math.round(totalInvested)
  };
}

type CustomTooltipTypeBar = {
  payload: any;
  active: boolean | undefined;
  label: any;
};

const customTooltip = (props: CustomTooltipTypeBar) => {
  const { payload, active } = props;
  if (!active || !payload) return null;
  const data = payload[0].payload;
  const years = Math.floor(data.year);
  const months = Math.round((data.year - years) * 10);
  return (
    <div className="border shadow rounded-md border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
      <div className="flex flex-col space-y-2">
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
      </div>
    </div>
  );
};

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

export default function AccumulationPhase() {
  const { monthlyInvestment, interest, goal, wealth } = useStore(
    state => state.accumulationPhase
  );
  const { salary, age, expense, targetExpenseToSave, inflation } = useStore(
    state => state.settings
  );
  const { inflationToggle, setInflationToggle } = useStore();
  const setAccumulationPhase = useStore(state => state.setAccumulationPhase);
  const computedData = useMemo(() => {
    const {
      years,
      wealthData,
      totalWealth,
      totalWealthWithoutInflation,
      months,
      totalInvested
    } = calculateInvestmentYearsWithWealthData(
      expense,
      monthlyInvestment,
      interest,
      goal,
      inflationToggle ? inflation : 0
    );

    const totalReturn = totalWealth - totalInvested;
    const percentageReturn = (totalReturn / totalInvested) * 100;
    const formattedPercentageReturn = percentageReturn.toFixed(2);

    const chartData = wealthData.map(dataPoint => ({
      year: dataPoint.year,
      wealth: dataPoint.wealth,
      invested: dataPoint.totalInvested
    }));

    const computedResults = {
      years,
      months,
      chartData,
      totalWealth,
      totalInvested,
      totalReturn,
      formattedPercentageReturn,
      totalWealthWithoutInflation,
    };

    return computedResults;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    expense,
    interest,
    monthlyInvestment,
    goal,
    setInflationToggle,
    inflationToggle
  ]);
  const monthlySalary = salary / 12; // salary is annual
  const { feedback } = calculateSavingsRate(monthlySalary, monthlyInvestment);

  const chartData = [
    {
      name: "accumulation",
      wealth: wealth
    },
    {
      name: "target",
      wealth: targetExpenseToSave
    }
  ];

  useEffect(() => {
    setAccumulationPhase({
      wealth: computedData.totalWealth,
      savingPeriod: computedData.years,
      data: computedData.chartData
    });
  }, [computedData, setAccumulationPhase]);

  return (
    <>
      <SettingsAlert />
      <MaxWidthWrapper className="flex flex-col pt-12 pb-16">
        <div className="mb-8">
          <h1 className="order-1 text-2xl font-semibold tracking-tight text-black">
            Accumulation Phase
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Of all the phases, this &quot;Accumulation Phase&quot; is the most
            important one. What we do in this phase decides whether we are going
            to touch the finish line in our marathon race or not. The goal of
            this phase is &quot;Accumulation&quot;. That means, maximizing the
            savings by reducing the expenses and living thrifty.
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Use this calculator to know how much you need to save and invest
            monthly to reach abundant phase.
          </p>
        </div>
        {/* <div className="flex flex-row items-center justify-between rounded-lg border mb-3 p-3 bg-white">
          <p className="text-sm">
            You&apos;ve set the inflation rate to {inflation}% in your settings.
            To disable it, you can do so here.
          </p>
          <Switch
            id="inflation-mode"
            checked={inflationToggle}
            onCheckedChange={setInflationToggle}
          />
        </div> */}
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
                  colors={["#e76e50", "#60a8fb"]}
                  showAnimation
                />
                <div>
                  <SummaryNumber
                    className="font-semibold text-lg transition-opacity flex items-center gap-2"
                    from={0}
                    to={computedData?.totalWealth}
                  />
                  <p className="text-sm text-gray-500 leading-6">
                    Projected Wealth{" "}
                    <span className="text-xs text-gray-500">
                      (by age {age + computedData?.years})
                    </span>
                  </p>
                </div>
              </div>
              <ul className="lg:grid-cols-2 mt-6 lg:mt-0 gap-[1px] grid-cols-1 grid bg-gray-200">
                <li className="lg:text-right lg:py-0 py-3 px-0 lg:px-4 bg-white">
                  <p className="font-semibold text-gray-900 text-sm">
                    <SummaryNumber
                      className="font-semibold text-gray-900 text-sm"
                      from={0}
                      to={computedData?.totalWealth}
                    />
                  </p>
                  <div className="space-x-2 flex items-center lg:justify-end">
                    <span className="bg-[#e76e50] w-3 h-3 rounded flex-shrink-0"></span>
                    <p className="text-sm text-gray-500">Accumulation Phase</p>
                  </div>
                </li>
                <li className="lg:text-right lg:py-0 py-3 px-0 lg:px-4 bg-white">
                  <p className="font-semibold text-gray-900 text-sm">
                    <SummaryNumber
                      className="font-semibold text-gray-900 text-sm"
                      from={0}
                      to={targetExpenseToSave - computedData?.totalWealth}
                    />
                  </p>
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
                          setAccumulationPhase({
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
                      setAccumulationPhase({ monthlyInvestment: vals[0] });
                    }}
                    min={1000}
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
                          setAccumulationPhase({
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
                      setAccumulationPhase({ goal: vals[0] });
                    }}
                    min={1}
                    step={1}
                    max={50}
                    className="w-full max-w-md !mt-6"
                    value={[goal]}
                  />
                  <p className="text-sm text-muted-foreground">
                    This phase recommends that you save and invest a minimum of
                    5 times your annual expenses.
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
                          setAccumulationPhase({
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
                      setAccumulationPhase({ interest: vals[0] });
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
                valueFormatter={n => formatNumber(n, "compact")}
                showLegend={false}
                customTooltip={customTooltip}
                xAxisLabel="Saving period (years)"
                yAxisLabel=" "
                showAnimation={true}
              />
            </div>
          </div>
          <div className="mt-10">
            <div className="flex items-center gap-2 font-heading scroll-m-20 text-lg font-semibold tracking-tight">
              <Sparkles className="w-5 h-5 text-[#CF6073]" /> Investment
              Insights
            </div>
            <ul className="ml-6 list-disc space-y-2 leading-7 [&:not(:first-child)]:mt-6">
              <li>
                <span className="font-medium">Savings Progress</span> - You will
                complete this phase in {computedData?.years} years with a monthly{" "}
                {formatNumber(monthlyInvestment)} SIP. By age{" "}
                {age + computedData?.years}, you will have{" "}
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
              {inflationToggle && (
                <li>
                  <span className="font-medium">Inflation</span> - With an
                  inflation rate of {inflation}%, the value of your money
                  decreases over time by{" "}
                  {formatNumber(
                    computedData?.totalWealth -
                      computedData?.totalWealthWithoutInflation
                  )}
                  .
                </li>
              )}
              <li>
                <span className="font-medium ">Investment Growth</span> -{" "}
                Potential capital gains of
                <span className="text-emerald-700 font-medium">
                  {" "}
                  {formatNumber(computedData?.totalReturn)} (
                  {computedData?.formattedPercentageReturn}%)
                </span>{" "}
                from your initial investment of{" "}
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
            <span className="font-medium ">Goal</span> - Maximize savings by
            reducing expenses and living frugally during the Accumulation Phase.
          </li>
          <li>
            <span className="font-medium ">Key Principle</span> - Take full
            advantage of Compounding by starting to save and invest early in
            your adult life.
          </li>
          <li>
            <span className="font-medium ">Saving Target</span> - Aim to save
            50-75% of your earnings. Prioritize Needs over Wants.
          </li>
          <li>
            <span className="font-medium ">Avoid Debt</span> - Don’t take on
            debt to impress others; wealth building is a marathon, not a sprint.
          </li>
          <li>
            <span className="font-medium ">Practical Tips</span> - Choose
            affordable essentials over luxury items (e.g., a basic bike over an
            expensive one). Delay purchasing a home to avoid financial drag.
            Invest in high-return assets like Index ETFs due to the long
            investment horizon.
          </li>
          <li>
            <span className="font-medium ">End Goal</span> - Save and invest 5
            times your annual expenses by the end of this phase. Protect and
            grow this nest egg for future wealth building.
          </li>
        </ul>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Saving and Spending
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          In this phase, it&apos;s advisable to save up to 75% of your earnings,
          or at the very least, aim for 50%. A crucial aspect to master during
          this time is understanding the difference between &quot;Needs&quot;
          and &quot;Wants.&quot; This is not the time to fulfill desires;
          rather, it&apos;s the time to focus on essential needs and defer wants
          to later phases.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          For instance, if you need a vehicle to commute to work, purchasing a
          reasonably priced bike for ₹50,000 or less addresses a
          &quot;Need.&quot; Conversely, opting for an expensive Bullet Bike for
          ₹2 lakhs caters to a &quot;Desire.&quot; It&apos;s better to avoid
          such desires during this phase as they can significantly impact your
          savings.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Many people might say, &quot;The main reason I got a job was to buy a
          new car or bike.&quot; While this is often an emotional impulse driven
          by long-held desires, the joy of owning a new vehicle typically lasts
          just a week. We must ask ourselves: is it worth sacrificing future
          financial growth for fleeting happiness?
        </p>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Long-Term Perspective: Wealth Building is a Marathon, Not a Sprint
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Wealth building is a marathon, not a 100-meter sprint. Unfortunately,
          many people treat it as a sprint, taking on debt to prove their
          success to society. If impressing others is your goal, then wealth
          building may not be achievable. Instead, focus on your financial goals
          without getting sidetracked by societal expectations.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          For example, instead of buying the latest iPhone, consider a more
          affordable Motorola phone with similar features. Moreover,
          there&apos;s no need to upgrade your phone annually; upgrading every
          three years should suffice. Buy based on your needs, not on the latest
          features.
        </p>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Housing and Rent: A Pragmatic Approach
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Avoid buying a home during this phase, as it can hinder your financial
          growth. Many will argue that paying rent is a waste of money. However,
          paying rent is often cheaper than paying interest on a home loan,
          especially in India. We&apos;ll delve deeper into this topic in a
          future episode.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Living a simple, non-materialistic life with a focus on savings is the
          key during the Accumulation Phase. This doesn&apos;t mean living like
          a miser, but rather living within your means. By the end of this
          phase, you should aim to have saved and invested five times your
          annual expenses. If you&apos;re saving 50% of your income, reaching
          this goal will be quicker than you might think possibly within just
          five years. If you manage to save 75%, you can complete this phase
          even faster.
        </p>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          What if you&apos;re starting late?
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Some of you might be thinking, &quot;This sounds great, but I&apos;m
          already close to 40. I can&apos;t save 50% to 75% of my income.&quot;
          While it&apos;s true that you can&apos;t undo past financial
          decisions, you can still maximize your savings rate and invest as much
          as possible. Additionally, it&apos;s crucial to teach your children
          about the benefits of early accumulation. While it&apos;s up to them
          to follow through, they should at least be aware of the option.
        </p>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Investment Strategy: Taking Calculated Risks
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The natural question that follows is: What kind of assets should we
          invest in during this phase? Given that this is the earliest phase, we
          have plenty of time before retirement, allowing us to take on more
          risk. Even if asset values decline in the short term, they have time
          to recover. Therefore, it&apos;s wise to invest in assets with the
          highest return potential, such as stocks.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          This doesn&apos;t mean you should dive into individual stock trading.
          Instead, consider investing in an Index ETF.
        </p>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
          The Nest Egg: Building a Strong Financial Base
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          By the end of the Accumulation Phase, your goal should be to have
          saved and invested five times your annual expenses. This investment is
          your nest egg, the foundation of your wealth-building journey.
          It&apos;s crucial not to touch this investment; let it grow and work
          for you.
        </p>
      </MaxWidthWrapper>
    </>
  );
}
