import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  TrendingUp, 
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  HelpCircle,
  Hash
} from 'lucide-react';
import { CalculatedProject, OptimizationResult } from '../../types';
import { formatCurrency, formatPercent, getRiskLabel } from '../../utils/formatters';
import { AlgorithmComplexitySection } from './AlgorithmComplexitySection';

interface OptimizerTabProps {
  budget: number;
  setBudget: (budget: number) => void;
  maxProjects: number;
  setMaxProjects: (max: number) => void;
  availableProjectsCount: number;
  result: OptimizationResult;
  allProjects: CalculatedProject[];
  onTriggerOptimize?: () => void;
}

export const OptimizerTab: React.FC<OptimizerTabProps> = ({
  budget,
  setBudget,
  maxProjects,
  setMaxProjects,
  availableProjectsCount,
  result,
  allProjects,
  onTriggerOptimize
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const budgetPresets = [250000, 500000, 750000, 1000000];

  // Dynamic presets for Maximum Projects based on available projects count
  const dynamicMaxOptions = [2, 3, 5, 8, 10].filter(opt => opt <= availableProjectsCount);

  // Validate whenever maxProjects or availableProjectsCount changes
  useEffect(() => {
    if (maxProjects > availableProjectsCount && availableProjectsCount > 0) {
      setValidationError(`Maximum projects cannot exceed the ${availableProjectsCount} available projects.`);
    } else if (maxProjects < 1) {
      setValidationError('Maximum projects must be at least 1.');
    } else {
      setValidationError(null);
    }
  }, [maxProjects, availableProjectsCount]);

  const handleMaxProjectsChange = (value: number) => {
    if (value > availableProjectsCount) {
      setValidationError(`Maximum projects cannot exceed the ${availableProjectsCount} available projects.`);
      setMaxProjects(value);
    } else if (value < 1) {
      setValidationError('Maximum projects must be at least 1.');
      setMaxProjects(1);
    } else {
      setValidationError(null);
      setMaxProjects(value);
    }
  };

  const handleManualOptimizeClick = () => {
    if (maxProjects > availableProjectsCount) {
      setValidationError(`Maximum projects cannot exceed the ${availableProjectsCount} available projects.`);
      return;
    }
    setIsOptimizing(true);
    if (onTriggerOptimize) onTriggerOptimize();
    setTimeout(() => setIsOptimizing(false), 300);
  };

  return (
    <div className="space-y-6">
      {/* Short System Explanation as specified in Section 11 */}
      <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <p className="text-xs sm:text-sm text-slate-300">
          InvestOptima selects the most valuable combination of investment projects while respecting the company's budget and maximum project-count limit.
        </p>
      </div>

      {/* 1. Investment Constraints Section */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              Investment Constraints
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify the available investment budget and the maximum number of projects the company allows
            </p>
          </div>

          {/* Prominent Optimization Button */}
          <button
            onClick={handleManualOptimizeClick}
            disabled={isOptimizing || !!validationError}
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition"
          >
            <Sparkles className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Optimizing...' : 'Optimize Project Selection'}</span>
          </button>
        </div>

        {/* 3 Main Constraint Inputs: Available Budget, Available Projects, Maximum Projects to Select */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Available Budget */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Available Budget
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  min="50000"
                  max="2000000"
                  step="25000"
                  value={budget}
                  onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
                  className="w-32 pl-6 pr-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <input
                type="range"
                min="50000"
                max="2000000"
                step="10000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹50,000</span>
                <span>₹10,00,000</span>
                <span>₹20,00,000</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Quick:</span>
              {budgetPresets.map((p) => (
                <button
                  key={p}
                  onClick={() => setBudget(p)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition ${
                    budget === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  {formatCurrency(p, true)}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Available Projects (Read-only dynamic count calculated from list) */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-cyan-400" />
                  Available Projects
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                  Auto-calculated
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Current projects in the company catalog</p>
            </div>

            <div className="my-2">
              <span className="text-3xl font-extrabold text-white font-mono">{availableProjectsCount}</span>
              <span className="text-xs text-slate-400 ml-2">projects available</span>
            </div>

            <p className="text-[11px] text-slate-500">
              Updates automatically as projects are added or deleted.
            </p>
          </div>

          {/* 3. Maximum Projects to Select (User-editable) */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                Maximum Projects to Select
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  min="1"
                  max={availableProjectsCount}
                  value={maxProjects}
                  onChange={(e) => handleMaxProjectsChange(Number(e.target.value))}
                  className={`w-16 px-2.5 py-1.5 bg-slate-900 border rounded-lg text-xs font-mono font-bold text-white text-center focus:outline-none focus:ring-2 ${
                    validationError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:ring-indigo-500'
                  }`}
                />
              </div>
            </div>

            <input
              type="range"
              min="1"
              max={Math.max(1, availableProjectsCount)}
              step="1"
              value={Math.min(maxProjects, availableProjectsCount)}
              onChange={(e) => handleMaxProjectsChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Limit:</span>
              {dynamicMaxOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleMaxProjectsChange(opt)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition ${
                    maxProjects === opt
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
              {availableProjectsCount > 0 && !dynamicMaxOptions.includes(availableProjectsCount) && (
                <button
                  onClick={() => handleMaxProjectsChange(availableProjectsCount)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition ${
                    maxProjects === availableProjectsCount
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  All ({availableProjectsCount})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Helper Text and Validation Messages as specified in Section 4 & 5 */}
        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-200 font-semibold">
              Select up to {maxProjects} of {availableProjectsCount} available projects
            </span>
          </div>

          {validationError && (
            <div className="flex items-center gap-1.5 text-rose-400 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Optimal Project Selection Results Section as specified in Section 9 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Optimal Project Selection
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {result.executionTimeMs} ms calculation time
          </span>
        </div>

        {/* 6 Key Stat Cards: Selected Projects, Total Investment, Remaining Budget, Expected Return, Expected Profit, Total NPV */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Selected Projects */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Selected Projects</span>
            <div className="mt-1 text-2xl font-extrabold text-white font-mono">
              {result.selectedProjects.length} / {availableProjectsCount}
            </div>
            <span className="text-[10px] text-slate-400">max allowed: {maxProjects}</span>
          </div>

          {/* Total Investment */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Investment</span>
            <div className="mt-1 text-2xl font-extrabold text-emerald-400 font-mono">
              {formatCurrency(result.totalInvestment)}
            </div>
            <span className="text-[10px] text-slate-400">{result.budgetUtilizationPercent}% of budget</span>
          </div>

          {/* Remaining Budget */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Remaining Budget</span>
            <div className="mt-1 text-2xl font-extrabold text-slate-300 font-mono">
              {formatCurrency(result.remainingBudget)}
            </div>
            <span className="text-[10px] text-slate-400">unallocated capital</span>
          </div>

          {/* Expected Return */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Expected Return</span>
            <div className="mt-1 text-2xl font-extrabold text-indigo-300 font-mono">
              {formatCurrency(result.expectedReturn)}
            </div>
            <span className="text-[10px] text-slate-400">total expected inflows</span>
          </div>

          {/* Expected Profit */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Expected Profit</span>
            <div className="mt-1 text-2xl font-extrabold text-teal-400 font-mono">
              +{formatCurrency(result.expectedProfit)}
            </div>
            <span className="text-[10px] text-slate-400">return &minus; investment</span>
          </div>

          {/* Total NPV */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total NPV</span>
            <div className="mt-1 text-2xl font-extrabold text-blue-400 font-mono">
              +{formatCurrency(result.totalNPV)}
            </div>
            <span className="text-[10px] text-slate-400">discounted value created</span>
          </div>
        </div>
      </div>

      {/* 3. Selected Projects Table as specified in Section 10 */}
      <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl overflow-hidden shadow-xl shadow-emerald-950/10">
        <div className="p-5 border-b border-slate-800 bg-slate-800/40 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Selected Projects
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Funded projects chosen to maximize total return while respecting both budget and project limits
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            {result.selectedProjects.length} of {maxProjects} Max Projects
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4 text-right">Investment</th>
                <th className="py-3.5 px-4 text-right">Expected Return</th>
                <th className="py-3.5 px-4 text-right">NPV</th>
                <th className="py-3.5 px-4 text-center">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {result.selectedProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                    No projects selected. Increase the budget or maximum project limit.
                  </td>
                </tr>
              ) : (
                result.selectedProjects.map((p) => {
                  const risk = getRiskLabel(p.riskScore);
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4 font-sans">
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] px-2 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {p.category}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            IRR: {formatPercent(p.metrics.irr)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-200">
                        {formatCurrency(p.initialInvestment)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-indigo-300">
                        {formatCurrency(p.metrics.totalUndiscountedCashFlow)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                        +{formatCurrency(p.metrics.npv)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-sans">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${risk.bg} ${risk.color}`}>
                          {risk.label} ({p.riskScore}/5)
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Unselected Proposals List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
              <XCircle className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-white text-base">Unselected Proposals</h3>
              <p className="text-xs text-slate-400">Excluded due to budget limits, project count limit, or lower financial return</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {result.unselectedProjects.length} Projects
          </span>
        </div>

        <div className="mt-4 space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {result.unselectedProjects.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              All available proposals are funded within current constraints.
            </div>
          ) : (
            result.unselectedProjects.map((p) => {
              const isNegativeNPV = p.metrics.npv <= 0;
              const exceedsBudget = p.initialInvestment > budget;
              const exceedsRemaining = p.initialInvestment > result.remainingBudget;
              const atProjectLimit = result.selectedProjects.length >= maxProjects;

              let exclusionReason = 'Alternative combination yielded higher total NPV return.';
              if (isNegativeNPV) {
                exclusionReason = 'Negative NPV: Project destroys shareholder value.';
              } else if (exceedsBudget) {
                exclusionReason = 'Cost exceeds total available budget cap.';
              } else if (atProjectLimit) {
                exclusionReason = `Maximum project limit (${maxProjects}) reached.`;
              } else if (exceedsRemaining) {
                exclusionReason = `Requires ${formatCurrency(p.initialInvestment)}, but only ${formatCurrency(result.remainingBudget)} headroom remaining.`;
              }

              return (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium text-slate-300 text-sm">{p.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 inline-block mt-1">
                        {p.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Outlay</span>
                      <span className="font-mono text-slate-400 text-sm">
                        {formatCurrency(p.initialInvestment)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-amber-400/90 font-medium">
                      {exclusionReason}
                    </span>
                    <span className="font-mono text-slate-500">
                      NPV: {formatCurrency(p.metrics.npv)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Algorithm Complexity Section */}
      <AlgorithmComplexitySection />
    </div>
  );
};
