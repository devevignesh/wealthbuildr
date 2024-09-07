interface WealthDataPoint {
  year: number;
  wealth: number;
  totalInvested: number;
}

export function calculateTotalWealth(
  expense: number,
  monthlyInvestment: number,
  annualReturnRate: number,
  goal: number
): { totalWealth: number } {
  let totalWealth = 0;
  const monthlyRate = annualReturnRate / 12 / 100;
  const targetAmount = expense * goal;

  while (totalWealth < targetAmount) {
    for (let month = 0; month < 12; month++) {
      totalWealth = (totalWealth + monthlyInvestment) * (1 + monthlyRate);
    }
  }

  return {
    totalWealth: Math.round(totalWealth)
  };
}

export function calculateWealthData(
  expense: number,
  monthlyInvestment: number,
  annualReturnRate: number,
  goal: number,
  initialWealth: number = 0
): {
  years: number;
  months: number;
  wealthData: WealthDataPoint[];
  totalWealth: number;
  totalInvested: number;
} {
  const wealthData: WealthDataPoint[] = [];
  let totalWealth = initialWealth;
  let totalInvested = initialWealth;
  let years = 0;
  const monthlyRate = annualReturnRate / 12 / 100;
  const targetAmount = expense * goal;

  while (totalWealth < targetAmount) {
    for (let month = 0; month < 12; month++) {
      totalWealth = (totalWealth + monthlyInvestment) * (1 + monthlyRate);
      totalInvested += monthlyInvestment;
    }

    years++;

    wealthData.push({
      year: years,
      wealth: Math.round(totalWealth),
      totalInvested: Math.round(totalInvested)
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
    totalInvested: Math.round(totalInvested)
  };
}
