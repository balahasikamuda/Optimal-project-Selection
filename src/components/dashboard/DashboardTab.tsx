import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Sliders, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Award,
  CheckCircle2,
  AlertTriangle,
  Hash,
  Coins
} from 'lucide-react';
import { CalculatedProject, OptimizationResult, ActiveTab } from '../../types';
import { StatCard } from './StatCard';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface DashboardTabProps {
  projects: CalculatedProject[];
  result: OptimizationResult;
  budget: number;
  maxProjects: number;
  setActiveTab: (tab: ActiveTab) => void;
  onAddProject: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  projects,
  result,
  budget,
  maxProjects,
  setActiveTab,
  onAddProject
}) => {
  const availableProjectsCount = projects.length;
  const positiveNPVCount = projects.filter(p => p.metrics.npv > 0).length;
  const negativeNPVCount = projects.length - positiveNPVCount;

  // Top 3 projects by Profitability Index
  const topProjectsByPI = [...projects]
    .filter(p => p.metrics.npv > 0)
    .sort((a, b) => b.metrics.profitabilityIndex - a.metrics.profitabilityIndex)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-6 sm:p-8 border border-blue-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Corporate Capital Investment Decision Support</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Smart Investment Project Selection System
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Select the most valuable combination of investment projects while respecting the company's budget and maximum project-count limit.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('optimizer')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition"
            >
              <Sliders className="w-4 h-4" />
              <span>Optimize Project Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onAddProject}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition"
            >
              <span>+ Add Investment Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Relationship Flow Card: Available Projects -> Maximum Projects -> Selected Projects */}
      <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Project Selection Pipeline
          </span>
          <span className="text-xs text-blue-400 font-semibold">
            Select up to {maxProjects} of {availableProjectsCount} available projects
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Step 1: Available Projects */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Available Projects</span>
              <span className="text-xs text-slate-500">Currently in catalog</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-white font-mono">{availableProjectsCount}</span>
            </div>
          </div>

          {/* Step 2: Maximum Projects to Select */}
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300 block">Maximum Projects to Select</span>
              <span className="text-xs text-indigo-400/80">Company limit</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-indigo-300 font-mono">{maxProjects}</span>
            </div>
          </div>

          {/* Step 3: Selected Projects */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300 block">Selected Projects</span>
              <span className="text-xs text-emerald-400/80">Optimal selection</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                {result.selectedProjects.length} / {availableProjectsCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main KPI Cards Grid: All 9 Required Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Available Budget */}
        <StatCard
          title="Available Budget"
          value={formatCurrency(budget)}
          subtitle="Total capital ceiling"
          icon={<DollarSign className="w-6 h-6" />}
          tooltip="Maximum capital available for allocation"
        />

        {/* Total Investment */}
        <StatCard
          title="Total Investment"
          value={formatCurrency(result.totalInvestment)}
          subtitle={`${result.budgetUtilizationPercent}% of budget allocated`}
          icon={<Coins className="w-6 h-6" />}
          highlight={true}
          tooltip="Total outlay required for selected projects"
        />

        {/* Remaining Budget */}
        <StatCard
          title="Remaining Budget"
          value={formatCurrency(result.remainingBudget)}
          subtitle="Unallocated capital buffer"
          icon={<DollarSign className="w-6 h-6" />}
          tooltip="Headroom remaining after funded projects"
        />

        {/* Expected Return */}
        <StatCard
          title="Expected Return"
          value={formatCurrency(result.expectedReturn)}
          subtitle="Total undiscounted cash inflows"
          icon={<TrendingUp className="w-6 h-6" />}
          tooltip="Sum of all future projected cash inflows from selected projects"
        />

        {/* Expected Profit */}
        <StatCard
          title="Expected Profit"
          value={`+${formatCurrency(result.expectedProfit)}`}
          subtitle="Expected Return &minus; Total Investment"
          icon={<TrendingUp className="w-6 h-6" />}
          trend={{
            value: `+${formatCurrency(result.expectedProfit)}`,
            isPositive: true
          }}
          tooltip="Total profit generated after recovering initial investment"
        />

        {/* Total NPV */}
        <StatCard
          title="Total NPV"
          value={`+${formatCurrency(result.totalNPV)}`}
          subtitle="Discounted economic value created"
          icon={<Award className="w-6 h-6" />}
          highlight={true}
          tooltip="Net Present Value maximized by the optimizer"
        />
      </div>

      {/* Two Column Layout: Viability Summary & Top Benefit/Cost Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Screening Summary Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            Financial Viability Screening
          </h3>
          <p className="text-xs text-slate-400 mt-1">Screening against company hurdle rates</p>

          <div className="mt-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-emerald-300 block">Viable (NPV &gt; 0)</span>
                  <span className="text-[11px] text-emerald-400/80">Positive shareholder value</span>
                </div>
              </div>
              <span className="text-xl font-bold font-mono text-emerald-400">{positiveNPVCount}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <div>
                  <span className="text-xs font-bold text-rose-300 block">Value Destructive (NPV &le; 0)</span>
                  <span className="text-[11px] text-rose-400/80">Fails cost of capital hurdle</span>
                </div>
              </div>
              <span className="text-xl font-bold font-mono text-rose-400">{negativeNPVCount}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-1">Company Selection Rule:</strong>
              Projects with negative NPV are automatically disqualified. The optimizer evaluates all viable proposals to select the highest-yielding combination that satisfies both the available budget and the maximum project limit.
            </div>
          </div>
        </div>

        {/* Top 3 Projects by Profitability Index */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Top Candidates by Capital Efficiency (Profitability Index)
              </h3>
              <p className="text-xs text-slate-400 mt-1">Ranking by Present Value generated per dollar invested (PI = PV / Initial Outlay)</p>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {topProjectsByPI.map((p, idx) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 hover:border-blue-500/40 transition relative overflow-hidden group"
              >
                <div className="absolute top-2 right-2 text-xs font-mono font-bold text-slate-600 group-hover:text-amber-400 transition">
                  #{idx + 1}
                </div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {p.category}
                </span>
                <h4 className="font-bold text-white text-sm mt-2 line-clamp-1">{p.name}</h4>
                <div className="mt-3 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Cost:</span>
                    <span className="text-slate-200">{formatCurrency(p.initialInvestment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">NPV:</span>
                    <span className="text-emerald-400 font-bold">+{formatCurrency(p.metrics.npv)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">PI:</span>
                    <span className="text-blue-400 font-bold">{p.metrics.profitabilityIndex.toFixed(2)}x</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3.5 bg-blue-950/20 border border-blue-900/30 rounded-xl flex items-center justify-between text-xs">
            <span className="text-blue-300">
              Budget: <strong className="font-mono text-white">{formatCurrency(budget)}</strong> &bull; Max Projects: <strong className="text-white">{maxProjects}</strong> &bull; Selected: <strong className="text-emerald-400">{result.selectedProjects.length} / {availableProjectsCount}</strong>
            </span>
            <button
              onClick={() => setActiveTab('optimizer')}
              className="text-blue-400 hover:text-white font-bold underline transition"
            >
              Configure & Optimize Selection &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
