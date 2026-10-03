import { CalculatedProject, OptimizationResult } from '../types';

/**
 * Solves the Cardinality-Constrained 0/1 Knapsack Problem for Corporate Capital Budgeting
 * using a Two-Dimensional Dynamic Programming table.
 * 
 * Objective: Maximize Sum(NPV_i * x_i)
 * Constraints:
 * 1. Sum(Cost_i * x_i) <= Available Budget (B)
 * 2. Sum(x_i) <= Maximum Projects to Select (K)
 * 3. x_i in {0, 1}
 * 
 * Algorithm Complexity:
 * - Time Complexity: Best Case O(n x B), Average Case O(n x B), Worst Case O(n x B)
 * - Space Complexity: O(n x B) using a two-dimensional dynamic programming table
 */
export function solve01Knapsack(
  projects: CalculatedProject[],
  availableBudget: number,
  maxProjectsLimit: number = projects.length
): OptimizationResult {
  const startTime = performance.now();
  const totalAvailableProjects = projects.length;

  // Filter only viable projects with positive NPV and valid initial investment
  const viableCandidates = projects.filter(p => p.initialInvestment > 0 && p.metrics.npv > 0);
  const n = viableCandidates.length;
  // Ensure kLimit is between 1 and min(maxProjectsLimit, n)
  const kLimit = Math.max(1, Math.min(maxProjectsLimit, n > 0 ? n : 1));

  // Discrete budget state step size (₹1,000 increments)
  const stepSize = 1000;
  const B = Math.max(1, Math.floor(availableBudget / stepSize));

  if (n === 0 || availableBudget <= 0 || maxProjectsLimit <= 0) {
    return {
      selectedProjects: [],
      unselectedProjects: projects,
      totalInvestment: 0,
      totalNPV: 0,
      expectedProfit: 0,
      totalInflows: 0,
      expectedReturn: 0,
      availableBudget,
      remainingBudget: availableBudget,
      budgetUtilizationPercent: 0,
      averageIRR: 0,
      weightedRiskScore: 0,
      maxProjectsLimit,
      totalAvailableProjects,
      executionTimeMs: Number((performance.now() - startTime).toFixed(2))
    };
  }

  // Two-dimensional dynamic programming table of states: dp[k][w]
  // Rows: project cardinality count (0 to kLimit <= n)
  // Columns: budget states (0 to B)
  // Space complexity: O(n x B)
  const dp: { npv: number; selected: CalculatedProject[] }[][] = Array.from(
    { length: kLimit + 1 },
    () => Array.from({ length: B + 1 }, () => ({ npv: 0, selected: [] }))
  );

  // Systematic 2D Dynamic Programming tabulation (O(n x B) in all cases)
  for (let i = 0; i < n; i++) {
    const project = viableCandidates[i];
    const costSteps = Math.ceil(project.initialInvestment / stepSize);
    const value = project.metrics.npv;

    for (let k = kLimit; k >= 1; k--) {
      for (let w = B; w >= costSteps; w--) {
        const prev = dp[k - 1][w - costSteps];
        const candidateVal = prev.npv + value;
        if (candidateVal > dp[k][w].npv) {
          dp[k][w] = {
            npv: candidateVal,
            selected: [...prev.selected, project]
          };
        }
      }
    }
  }

  // Retrieve the optimal project selection satisfying both constraints
  let best = { npv: 0, selected: [] as CalculatedProject[] };
  for (let k = 0; k <= kLimit; k++) {
    if (dp[k][B].npv > best.npv) {
      best = dp[k][B];
    }
  }

  const selectedSet = new Set(best.selected.map(p => p.id));
  const unselectedProjects = projects.filter(p => !selectedSet.has(p.id));

  const totalInvestment = best.selected.reduce((sum, p) => sum + p.initialInvestment, 0);
  const totalNPV = best.selected.reduce((sum, p) => sum + p.metrics.npv, 0);
  const totalInflows = best.selected.reduce((sum, p) => sum + p.metrics.totalUndiscountedCashFlow, 0);
  const expectedProfit = totalInflows - totalInvestment;

  const remainingBudget = Math.max(0, availableBudget - totalInvestment);
  const budgetUtilizationPercent = availableBudget > 0 
    ? Number(((totalInvestment / availableBudget) * 100).toFixed(1)) 
    : 0;

  const validIRRs = best.selected.map(p => p.metrics.irr).filter((irr): irr is number => irr !== null);
  const averageIRR = validIRRs.length > 0 
    ? Number((validIRRs.reduce((a, b) => a + b, 0) / validIRRs.length).toFixed(2)) 
    : 0;

  const weightedRiskScore = totalInvestment > 0 
    ? Number((best.selected.reduce((sum, p) => sum + p.riskScore * p.initialInvestment, 0) / totalInvestment).toFixed(2)) 
    : 0;

  const executionTimeMs = Number((performance.now() - startTime).toFixed(2));

  return {
    selectedProjects: best.selected,
    unselectedProjects,
    totalInvestment,
    totalNPV,
    expectedProfit,
    totalInflows,
    expectedReturn: totalInflows,
    availableBudget,
    remainingBudget,
    budgetUtilizationPercent,
    averageIRR,
    weightedRiskScore,
    maxProjectsLimit,
    totalAvailableProjects,
    executionTimeMs
  };
}
