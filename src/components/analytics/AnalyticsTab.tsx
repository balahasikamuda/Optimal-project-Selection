import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  PieChart as PieIcon, 
  Sliders, 
  ShieldAlert, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { CalculatedProject, OptimizationResult } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { calculateNPV } from '../../utils/financialEngine';

interface AnalyticsTabProps {
  projects: CalculatedProject[];
  result: OptimizationResult;
}

const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  projects,
  result
}) => {
  // Global sensitivity discount rate slider (default 10%)
  const [sensitivityRatePercent, setSensitivityRatePercent] = useState<number>(10);

  // 1. Cumulative Cash Flow Trajectory for Selected Portfolio
  const cumulativeCashFlowData = useMemo(() => {
    const selected = result.selectedProjects;
    if (selected.length === 0) return [];

    const maxYears = Math.max(...selected.map(p => p.cashFlows.length), 5);
    const data = [];

    // Year 0
    let cumulative = -result.totalInvestment;
    data.push({
      year: 'Year 0',
      netCashFlow: -result.totalInvestment,
      cumulative: cumulative,
      breakevenLine: 0
    });

    for (let yr = 1; yr <= maxYears; yr++) {
      let annualInflow = 0;
      selected.forEach(p => {
        if (p.cashFlows[yr - 1] !== undefined) {
          annualInflow += p.cashFlows[yr - 1];
        }
      });
      cumulative += annualInflow;
      data.push({
        year: `Year ${yr}`,
        netCashFlow: annualInflow,
        cumulative: cumulative,
        breakevenLine: 0
      });
    }

    return data;
  }, [result]);

  // 2. Capital Allocation Pie Chart Data
  const allocationPieData = useMemo(() => {
    const data: { name: string; value: number; category: string }[] = result.selectedProjects.map(p => ({
      name: p.name,
      value: p.initialInvestment,
      category: p.category
    }));

    if (result.remainingBudget > 0) {
      data.push({
        name: 'Unallocated Budget Buffer',
        value: result.remainingBudget,
        category: 'Cash Buffer'
      });
    }
    return data;
  }, [result]);

  // 3. Risk vs Return Data
  const riskReturnData = useMemo(() => {
    const selectedSet = new Set(result.selectedProjects.map(p => p.id));
    return projects
      .filter(p => p.metrics.irr !== null)
      .map(p => ({
        id: p.id,
        name: p.name,
        risk: p.riskScore,
        irr: p.metrics.irr ?? 0,
        npv: p.metrics.npv,
        cost: p.initialInvestment,
        isSelected: selectedSet.has(p.id)
      }));
  }, [projects, result]);

  // 4. Sensitivity Analysis Matrix under varied discount rates
  const sensitivityData = useMemo(() => {
    const r = sensitivityRatePercent / 100;
    return projects.map(p => {
      const simulatedNPV = calculateNPV(p.initialInvestment, p.cashFlows, r);
      const isViable = simulatedNPV > 0;
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        baseNPV: p.metrics.npv,
        simulatedNPV: Math.round(simulatedNPV),
        isViable,
        delta: Math.round(simulatedNPV - p.metrics.npv)
      };
    });
  }, [projects, sensitivityRatePercent]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Visual Analytics & Sensitivity Simulation
          </h2>
          <p className="text-xs text-slate-400">
            Project cash flow trajectories, capital risk profiles, and stress testing
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-slate-300">
          <span>Selected Projects: <strong>{result.selectedProjects.length}</strong></span>
          <span className="text-slate-600">|</span>
          <span>NPV: <strong className="text-emerald-400">{formatCurrency(result.totalNPV)}</strong></span>
        </div>
      </div>

      {/* Grid: Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative Cash Flow Trajectory */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Cumulative Cash Flow & Breakeven Curve
              </h3>
              <p className="text-xs text-slate-400">Tracking aggregate investment recovery across lifespan</p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Selected Projects
            </span>
          </div>

          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeCashFlowData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" textAnchor="middle" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tickFormatter={(val) => formatCurrency(val, true)}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: number) => [formatCurrency(val), 'Cumulative Position']}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10b981' }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="breakevenLine"
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center text-xs text-slate-400">
            Red dashed line indicates <span className="text-rose-400 font-semibold">₹0 Breakeven line</span>. Point where green line crosses above is investment payback.
          </div>
        </div>

        {/* Capital Allocation Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-blue-400" />
                Budget Allocation Share
              </h3>
              <p className="text-xs text-slate-400">Distribution of available capital across projects</p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {formatCurrency(result.availableBudget)} Cap
            </span>
          </div>

          <div className="h-72 mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {allocationPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: number) => [formatCurrency(val), 'Capital Outlay']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            {allocationPieData.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate max-w-[120px]">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk vs Return Efficient Frontier */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Risk vs. Return Frontier (IRR % vs. Risk Level)
            </h3>
            <p className="text-xs text-slate-400">Green markers represent projects selected by the 0/1 Knapsack optimizer</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Funded in Portfolio
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
              <span className="w-3 h-3 rounded-full bg-slate-600" /> Unfunded Candidate
            </span>
          </div>
        </div>

        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                dataKey="risk"
                name="Risk Score"
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                stroke="#64748b"
                tickFormatter={(v) => `Risk ${v}`}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="irr"
                name="IRR"
                unit="%"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
              />
              <ZAxis type="number" dataKey="cost" range={[100, 400]} name="Outlay" />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                formatter={(val: number, name: string) => {
                  if (name === 'IRR') return [`${val}%`, 'IRR'];
                  if (name === 'Risk Score') return [`${val} / 5`, 'Risk Level'];
                  return [val, name];
                }}
              />
              <Scatter data={riskReturnData}>
                {riskReturnData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isSelected ? '#10b981' : '#475569'}
                    stroke={entry.isSelected ? '#34d399' : '#64748b'}
                    strokeWidth={2}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensitivity Analysis Simulator */}
      <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Sliders className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-white text-base">Discount Rate Sensitivity Stress-Tester</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulate interest rate and inflation shifts to observe how project valuations respond
            </p>
          </div>

          {/* Slider */}
          <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700">
            <span className="text-xs font-semibold text-slate-300">Simulated Hurdle Rate:</span>
            <input
              type="range"
              min="5"
              max="22"
              step="0.5"
              value={sensitivityRatePercent}
              onChange={(e) => setSensitivityRatePercent(Number(e.target.value))}
              className="w-32 sm:w-48 accent-indigo-500 cursor-pointer"
            />
            <span className="text-sm font-bold font-mono text-indigo-400 min-w-[50px]">
              {sensitivityRatePercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Sensitivity Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/40 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Project Title</th>
                <th className="py-2.5 px-3">Base NPV</th>
                <th className="py-2.5 px-3">Simulated NPV (@ {sensitivityRatePercent}%)</th>
                <th className="py-2.5 px-3">Valuation Shift</th>
                <th className="py-2.5 px-3 text-center">Viability Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sensitivityData.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/20">
                  <td className="py-2.5 px-3 font-sans text-slate-200 font-medium">{item.name}</td>
                  <td className="py-2.5 px-3 text-slate-400">{formatCurrency(item.baseNPV)}</td>
                  <td className={`py-2.5 px-3 font-bold ${item.simulatedNPV > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatCurrency(item.simulatedNPV)}
                  </td>
                  <td className={`py-2.5 px-3 ${item.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.delta >= 0 ? '+' : ''}{formatCurrency(item.delta)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.isViable ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-sans font-bold">
                        VIABLE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-sans font-bold">
                        REJECTED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
