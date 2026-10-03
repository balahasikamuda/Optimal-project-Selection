export interface Project {
  id: string;
  name: string;
  category: 'Renewable Energy' | 'Technology' | 'R&D' | 'Manufacturing' | 'Infrastructure' | 'Healthcare';
  initialInvestment: number; // In currency units (INR - ₹)
  cashFlows: number[];       // Annual net cash inflows: Year 1, Year 2, ...
  discountRate: number;      // Annual discount rate (e.g. 0.10 for 10%)
  riskScore: number;         // 1 (Low) to 5 (High)
  strategicScore: number;    // 1 (Low) to 5 (High alignment)
  description: string;
}

export interface ProjectMetrics {
  npv: number;                         // Net Present Value
  irr: number | null;                  // Internal Rate of Return (in %)
  paybackPeriod: number | null;        // In years
  discountedPaybackPeriod: number | null; // In years
  profitabilityIndex: number;          // PI = PV of Cash Inflows / Initial Outlay
  roi: number;                         // Return on Investment %
  totalUndiscountedCashFlow: number;   // Sum of undiscounted inflows (Total Expected Return)
  netProfit: number;                   // Undiscounted Inflows - Outlay (Expected Profit)
}

export interface CalculatedProject extends Project {
  metrics: ProjectMetrics;
}

export interface OptimizationResult {
  selectedProjects: CalculatedProject[];
  unselectedProjects: CalculatedProject[];
  totalInvestment: number;
  totalNPV: number;
  expectedProfit: number;
  totalInflows: number;
  expectedReturn: number;
  availableBudget: number;
  remainingBudget: number;
  budgetUtilizationPercent: number;
  averageIRR: number;
  weightedRiskScore: number;
  maxProjectsLimit: number;
  totalAvailableProjects: number;
  executionTimeMs: number;
}

export type ActiveTab = 'dashboard' | 'projects' | 'optimizer' | 'analytics';
