import { Project, ProjectMetrics } from '../types';

/**
 * Calculates Net Present Value (NPV)
 * Formula: NPV = -InitialOutlay + Sum(CF_t / (1 + r)^t)
 */
export function calculateNPV(initialInvestment: number, cashFlows: number[], discountRate: number): number {
  if (initialInvestment <= 0) return 0;
  
  let pvOfInflows = 0;
  for (let t = 0; t < cashFlows.length; t++) {
    const year = t + 1;
    pvOfInflows += cashFlows[t] / Math.pow(1 + discountRate, year);
  }
  return pvOfInflows - initialInvestment;
}

/**
 * Calculates Internal Rate of Return (IRR) using the Newton-Raphson method
 * with a Bisection fallback for robust convergence.
 * Returns IRR as a percentage (e.g. 15.2 for 15.2%), or null if unsolvable.
 */
export function calculateIRR(initialInvestment: number, cashFlows: number[], maxIterations: number = 100, tolerance: number = 1e-6): number | null {
  if (initialInvestment <= 0 || cashFlows.length === 0) return null;

  // Check if all cash flows are negative or zero (no IRR exists)
  const sumInflows = cashFlows.reduce((a, b) => a + b, 0);
  if (sumInflows <= 0) return null;

  // NPV function at rate r
  const npvAt = (r: number): number => {
    let npv = -initialInvestment;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + r, t + 1);
    }
    return npv;
  };

  // Derivative of NPV with respect to r: d(NPV)/dr
  const dNpvAt = (r: number): number => {
    let dNpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const year = t + 1;
      dNpv -= (year * cashFlows[t]) / Math.pow(1 + r, year + 1);
    }
    return dNpv;
  };

  // Try Newton-Raphson starting with a reasonable guess (10%)
  let rate = 0.1;
  for (let i = 0; i < maxIterations; i++) {
    const value = npvAt(rate);
    if (Math.abs(value) < tolerance) {
      return Number((rate * 100).toFixed(2));
    }

    const derivative = dNpvAt(rate);
    if (Math.abs(derivative) < 1e-9) break; // Derivative too flat

    const newRate = rate - value / derivative;

    // If Newton-Raphson diverges to extreme boundaries, switch to bisection
    if (newRate < -0.9 || newRate > 10.0 || isNaN(newRate)) {
      break;
    }
    rate = newRate;
  }

  // Bisection fallback between -0.5 (-50%) and 5.0 (+500%)
  let low = -0.5;
  let high = 5.0;
  let npvLow = npvAt(low);
  let npvHigh = npvAt(high);

  if (npvLow * npvHigh > 0) {
    // If same sign, try wider range
    high = 10.0;
    npvHigh = npvAt(high);
    if (npvLow * npvHigh > 0) {
      return null;
    }
  }

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    const npvMid = npvAt(mid);

    if (Math.abs(npvMid) < tolerance) {
      return Number((mid * 100).toFixed(2));
    }

    if (npvLow * npvMid < 0) {
      high = mid;
      npvHigh = npvMid;
    } else {
      low = mid;
      npvLow = npvMid;
    }
  }

  return Number((((low + high) / 2) * 100).toFixed(2));
}

/**
 * Calculates Simple Payback Period in years
 * Linear interpolation within the year of breakeven
 */
export function calculatePaybackPeriod(initialInvestment: number, cashFlows: number[]): number | null {
  if (initialInvestment <= 0 || cashFlows.length === 0) return null;

  let cumulative = 0;
  for (let t = 0; t < cashFlows.length; t++) {
    const prev = cumulative;
    cumulative += cashFlows[t];

    if (cumulative >= initialInvestment) {
      const year = t; // completed previous years
      const needed = initialInvestment - prev;
      const fraction = cashFlows[t] > 0 ? needed / cashFlows[t] : 0;
      return Number((year + fraction).toFixed(2));
    }
  }
  return null; // Investment not recovered within cash flows duration
}

/**
 * Calculates Discounted Payback Period in years
 * Incorporates time value of money into payback calculation
 */
export function calculateDiscountedPaybackPeriod(initialInvestment: number, cashFlows: number[], discountRate: number): number | null {
  if (initialInvestment <= 0 || cashFlows.length === 0) return null;

  let cumulative = 0;
  for (let t = 0; t < cashFlows.length; t++) {
    const prev = cumulative;
    const discountedFlow = cashFlows[t] / Math.pow(1 + discountRate, t + 1);
    cumulative += discountedFlow;

    if (cumulative >= initialInvestment) {
      const year = t;
      const needed = initialInvestment - prev;
      const fraction = discountedFlow > 0 ? needed / discountedFlow : 0;
      return Number((year + fraction).toFixed(2));
    }
  }
  return null;
}

/**
 * Calculates Profitability Index (PI) / Benefit-Cost Ratio
 * PI = PV of Future Cash Inflows / Initial Investment
 */
export function calculateProfitabilityIndex(initialInvestment: number, cashFlows: number[], discountRate: number): number {
  if (initialInvestment <= 0) return 0;
  const npv = calculateNPV(initialInvestment, cashFlows, discountRate);
  const pvOfInflows = npv + initialInvestment;
  return Number((pvOfInflows / initialInvestment).toFixed(3));
}

/**
 * Evaluates all financial metrics for a project
 */
export function evaluateProjectMetrics(project: Project): ProjectMetrics {
  const npv = calculateNPV(project.initialInvestment, project.cashFlows, project.discountRate);
  const irr = calculateIRR(project.initialInvestment, project.cashFlows);
  const payback = calculatePaybackPeriod(project.initialInvestment, project.cashFlows);
  const discountedPayback = calculateDiscountedPaybackPeriod(project.initialInvestment, project.cashFlows, project.discountRate);
  const pi = calculateProfitabilityIndex(project.initialInvestment, project.cashFlows, project.discountRate);

  const totalUndiscounted = project.cashFlows.reduce((a, b) => a + b, 0);
  const netProfit = totalUndiscounted - project.initialInvestment;
  const roi = project.initialInvestment > 0 ? Number(((netProfit / project.initialInvestment) * 100).toFixed(2)) : 0;

  return {
    npv: Math.round(npv),
    irr,
    paybackPeriod: payback,
    discountedPaybackPeriod: discountedPayback,
    profitabilityIndex: pi,
    roi,
    totalUndiscountedCashFlow: totalUndiscounted,
    netProfit
  };
}
