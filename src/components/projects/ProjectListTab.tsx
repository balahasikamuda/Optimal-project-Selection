import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Trash2, 
  FileSpreadsheet, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Clock,
  Gauge,
  Percent,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { CalculatedProject, Project } from '../../types';
import { formatCurrency, formatPercent, getRiskLabel } from '../../utils/formatters';

interface ProjectListTabProps {
  projects: CalculatedProject[];
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  selectedIdsInOptimizer: Set<string>;
}

export const ProjectListTab: React.FC<ProjectListTabProps> = ({
  projects,
  onAddProject,
  onEditProject,
  onDeleteProject,
  selectedIdsInOptimizer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'npv' | 'irr' | 'investment' | 'pi' | 'risk'>('npv');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [projects]);

  const filteredAndSorted = useMemo(() => {
    return projects
      .filter(p => {
        const matchesSearch = 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        switch (sortBy) {
          case 'npv':
            valA = a.metrics.npv;
            valB = b.metrics.npv;
            break;
          case 'irr':
            valA = a.metrics.irr ?? -999;
            valB = b.metrics.irr ?? -999;
            break;
          case 'investment':
            valA = a.initialInvestment;
            valB = b.initialInvestment;
            break;
          case 'pi':
            valA = a.metrics.profitabilityIndex;
            valB = b.metrics.profitabilityIndex;
            break;
          case 'risk':
            valA = a.riskScore;
            valB = b.riskScore;
            break;
        }
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [projects, searchTerm, selectedCategory, sortBy, sortOrder]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const exportCSV = () => {
    const headers = [
      'Project ID',
      'Name',
      'Category',
      'Initial Outlay (₹)',
      'Discount Rate (%)',
      'NPV (₹)',
      'IRR (%)',
      'Payback Period (Years)',
      'Profitability Index',
      'Risk Score',
      'Strategic Score',
      'Knapsack Selected'
    ];

    const rows = projects.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.initialInvestment,
      (p.discountRate * 100).toFixed(1),
      p.metrics.npv,
      p.metrics.irr !== null ? p.metrics.irr : 'N/A',
      p.metrics.paybackPeriod !== null ? p.metrics.paybackPeriod : 'N/A',
      p.metrics.profitabilityIndex,
      p.riskScore,
      p.strategicScore,
      selectedIdsInOptimizer.has(p.id) ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `investoptima_projects_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Projects Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-800/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Available Investment Projects
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage company capital proposals, cash flow projections, and valuation metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/30 font-mono font-bold text-xs shadow-sm">
            {projects.length} Projects Available
          </span>
        </div>
      </div>

      {/* Top Controls: Search, Filter, Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex-1 flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, category, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={exportCSV}
            title="Download complete project catalog as CSV"
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onAddProject}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Project / Category</th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition"
                  onClick={() => toggleSort('investment')}
                >
                  <div className="flex items-center gap-1">
                    <span>Initial Cost</span>
                    {sortBy === 'investment' && (sortOrder === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />)}
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition"
                  onClick={() => toggleSort('npv')}
                >
                  <div className="flex items-center gap-1">
                    <span>Net Present Value (NPV)</span>
                    {sortBy === 'npv' && (sortOrder === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />)}
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition"
                  onClick={() => toggleSort('irr')}
                >
                  <div className="flex items-center gap-1">
                    <span>IRR (%)</span>
                    {sortBy === 'irr' && (sortOrder === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />)}
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition"
                  onClick={() => toggleSort('pi')}
                >
                  <div className="flex items-center gap-1">
                    <span>PI (Benefit/Cost)</span>
                    {sortBy === 'pi' && (sortOrder === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />)}
                  </div>
                </th>
                <th className="py-3.5 px-4">Payback</th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition"
                  onClick={() => toggleSort('risk')}
                >
                  <div className="flex items-center gap-1">
                    <span>Risk</span>
                    {sortBy === 'risk' && (sortOrder === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />)}
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Optimizer Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm font-medium">No projects found matching current criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((project) => {
                  const isPositiveNPV = project.metrics.npv > 0;
                  const isExpanded = expandedProjectId === project.id;
                  const isSelectedInOptimizer = selectedIdsInOptimizer.has(project.id);
                  const riskInfo = getRiskLabel(project.riskScore);

                  return (
                    <React.Fragment key={project.id}>
                      <tr 
                        className={`hover:bg-slate-800/40 transition group cursor-pointer ${
                          isExpanded ? 'bg-slate-800/30' : ''
                        }`}
                        onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
                      >
                        {/* Name & Category */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white group-hover:text-blue-400 transition flex items-center gap-2">
                            {project.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                              {project.category}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {project.cashFlows.length} yrs duration
                            </span>
                          </div>
                        </td>

                        {/* Initial Investment */}
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                          {formatCurrency(project.initialInvestment)}
                        </td>

                        {/* NPV */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-1.5">
                            {isPositiveNPV ? (
                              <TrendingUp className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-rose-400" />
                            )}
                            <span
                              className={`font-bold font-mono ${
                                isPositiveNPV ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {formatCurrency(project.metrics.npv)}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            @ {(project.discountRate * 100).toFixed(1)}% hurdle
                          </span>
                        </td>

                        {/* IRR */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-semibold text-indigo-300">
                            {formatPercent(project.metrics.irr)}
                          </span>
                        </td>

                        {/* Profitability Index */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${
                              project.metrics.profitabilityIndex >= 1.0
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {project.metrics.profitabilityIndex.toFixed(2)}x
                          </span>
                        </td>

                        {/* Payback */}
                        <td className="py-3.5 px-4 text-xs font-mono text-slate-300">
                          {project.metrics.paybackPeriod !== null ? (
                            <span>{project.metrics.paybackPeriod} yrs</span>
                          ) : (
                            <span className="text-slate-500">Never</span>
                          )}
                        </td>

                        {/* Risk */}
                        <td className="py-3.5 px-4">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${riskInfo.bg} ${riskInfo.color}`}>
                            {riskInfo.label} ({project.riskScore}/5)
                          </span>
                        </td>

                        {/* Optimizer Selection Status */}
                        <td className="py-3.5 px-4 text-center">
                          {isSelectedInOptimizer ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full shadow-sm shadow-emerald-500/10">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Selected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded-full">
                              <XCircle className="w-3.5 h-3.5" />
                              Not Selected
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => onEditProject(project)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                              title="Edit Project"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteProject(project.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Delete Project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                              title="Toggle Cash Flow Breakdown"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Cash Flow Schedule Row */}
                      {isExpanded && (
                        <tr className="bg-slate-950/70 border-b border-slate-800">
                          <td colSpan={9} className="p-4 sm:p-6">
                            <div className="space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Project Valuation Breakdown & Cash Flow Trajectory
                                  </h4>
                                  <p className="text-xs text-slate-300 mt-0.5">{project.description}</p>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                  <span className="text-slate-400">
                                    Total Inflows: <strong className="text-white font-mono">{formatCurrency(project.metrics.totalUndiscountedCashFlow)}</strong>
                                  </span>
                                  <span className="text-slate-400">
                                    Net ROI: <strong className="text-emerald-400 font-mono">+{project.metrics.roi}%</strong>
                                  </span>
                                </div>
                              </div>

                              {/* Cash Flows Table */}
                              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
                                <table className="w-full text-xs text-left">
                                  <thead>
                                    <tr className="border-b border-slate-800 bg-slate-800/40 text-slate-400 font-semibold">
                                      <th className="py-2.5 px-3">Period</th>
                                      <th className="py-2.5 px-3">Year 0 (Outlay)</th>
                                      {project.cashFlows.map((_, i) => (
                                        <th key={i} className="py-2.5 px-3">Year {i + 1}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800 font-mono">
                                    <tr>
                                      <td className="py-2.5 px-3 font-sans font-semibold text-slate-300">Undiscounted Cash Flow</td>
                                      <td className="py-2.5 px-3 text-rose-400 font-medium">-{formatCurrency(project.initialInvestment)}</td>
                                      {project.cashFlows.map((cf, i) => (
                                        <td key={i} className="py-2.5 px-3 text-emerald-400">+{formatCurrency(cf)}</td>
                                      ))}
                                    </tr>
                                    <tr>
                                      <td className="py-2.5 px-3 font-sans font-semibold text-slate-300">Discounted Flow (PV)</td>
                                      <td className="py-2.5 px-3 text-rose-400 font-medium">-{formatCurrency(project.initialInvestment)}</td>
                                      {project.cashFlows.map((cf, i) => {
                                        const pv = cf / Math.pow(1 + project.discountRate, i + 1);
                                        return (
                                          <td key={i} className="py-2.5 px-3 text-slate-300">
                                            +{formatCurrency(Math.round(pv))}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
