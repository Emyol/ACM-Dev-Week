import { Allocation } from './types';

export function calculateFinancials(income: number, savingsPct: number, allocations: Allocation[]) {
  const takeHome = Math.round(income * 0.84); // 16% deduction estimate
  const allocTotal = allocations.reduce((s, a) => s + a.amount, 0);
  const remaining = Math.max(0, takeHome - allocTotal);
  
  const savingsAmt = Math.round(remaining * savingsPct);
  const spendingAmt = remaining - savingsAmt;
  
  const truePct = takeHome > 0 ? savingsAmt / takeHome : 0;
  
  const annualSavings = savingsAmt * 12;

  return {
    takeHome,
    allocTotal,
    remaining,
    savingsAmt,
    spendingAmt,
    truePct,
    annualSavings,
  };
}

export function calculateDreamProgress(target: number, currentSaved: number, monthlyContribution: number) {
  const remainingTarget = Math.max(0, target - currentSaved);
  const monthsLeft = monthlyContribution > 0 ? Math.ceil(remainingTarget / monthlyContribution) : 999;
  
  return {
    remainingTarget,
    monthsLeft,
  };
}
