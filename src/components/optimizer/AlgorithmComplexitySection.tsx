import React from 'react';
import { Cpu, Clock, Database, Info, Layers } from 'lucide-react';

export const AlgorithmComplexitySection: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Algorithm Complexity</h3>
            <p className="text-xs text-slate-400">
              0/1 Knapsack dynamic programming time and space complexity specifications
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
            Method: 2D Dynamic Programming
          </span>
        </div>
      </div>

      {/* Parameter Definitions */}
      <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
          Notation:
        </span>
        <div className="flex items-center gap-1.5 font-mono text-slate-200">
          <span className="text-blue-400 font-bold">n</span>
          <span className="text-slate-400">=</span>
          <span>number of available investment projects</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-slate-200">
          <span className="text-indigo-400 font-bold">B</span>
          <span className="text-slate-400">=</span>
          <span>number of budget states used by the dynamic programming algorithm</span>
        </div>
      </div>

      {/* Time & Space Complexity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Complexity Card & Table */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/70 space-y-3">
          <div className="flex items-center space-x-2 text-slate-200">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Time Complexity
            </h4>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-700/80">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-800/90 text-slate-400 font-semibold border-b border-slate-700">
                  <th className="py-2.5 px-3">Case</th>
                  <th className="py-2.5 px-3">Time Complexity</th>
                  <th className="py-2.5 px-3">Operational Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-semibold text-emerald-400">Best Case</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-white">O(n &times; B)</td>
                  <td className="py-2.5 px-3 text-slate-400">
                    The minimum amount of work required by the algorithm for an input of a given size.
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-semibold text-blue-400">Average Case</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-white">O(n &times; B)</td>
                  <td className="py-2.5 px-3 text-slate-400">
                    The expected amount of work over typical inputs of a given size.
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-semibold text-indigo-400">Worst Case</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-white">O(n &times; B)</td>
                  <td className="py-2.5 px-3 text-slate-400">
                    The maximum amount of work required for an input of a given size.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            For the standard dynamic programming approach, all three cases have <strong className="text-white font-mono">O(n &times; B)</strong> time complexity because the algorithm evaluates the project and budget states systematically.
          </p>
        </div>

        {/* Space Complexity Card */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/70 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-200">
              <Database className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Space Complexity
              </h4>
            </div>

            <div className="mt-3 p-3.5 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Memory Allocation</span>
                <span className="text-sm text-white font-semibold">Two-Dimensional DP Table</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block uppercase tracking-wider text-[10px]">Big-O Space</span>
                <span className="text-xl font-mono font-extrabold text-cyan-400">O(n &times; B)</span>
              </div>
            </div>

            <div className="mt-3 space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Space Complexity:</strong> Describes how much memory the algorithm needs as the input size increases.
              </p>
              <p className="text-slate-400">
                InvestOptima implements a <strong className="text-slate-200">two-dimensional dynamic programming table</strong> of size <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded font-mono">(K + 1) &times; (B + 1)</code> to systematically store intermediate optimal values and backtrack the exact combination of selected projects.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
            Evaluates both budget ceiling and maximum project count limits in a single matrix pass.
          </div>
        </div>
      </div>

      {/* Conceptual Summary Banner */}
      <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>
            <strong className="text-slate-200">Time Complexity:</strong> Describes how computation time grows as the number of projects (<code className="text-blue-300 font-mono">n</code>) and budget states (<code className="text-indigo-300 font-mono">B</code>) increase.
          </p>
          <p>
            <strong className="text-slate-200">Space Complexity:</strong> Describes how much memory the algorithm allocates to solve the decision problem.
          </p>
        </div>
      </div>
    </div>
  );
};
