import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, HelpCircle, Check, Sparkles } from 'lucide-react';
import { Project } from '../../types';
import { calculateNPV, calculateIRR, calculatePaybackPeriod } from '../../utils/financialEngine';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  initialProject?: Project | null;
}

const CATEGORIES: Project['category'][] = [
  'Renewable Energy',
  'Technology',
  'Infrastructure',
  'Healthcare',
  'Manufacturing',
  'R&D'
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProject
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Project['category']>('Technology');
  const [initialInvestment, setInitialInvestment] = useState<number>(100000);
  const [cashFlows, setCashFlows] = useState<number[]>([35000, 40000, 45000, 50000]);
  const [discountRatePercent, setDiscountRatePercent] = useState<number>(10);
  const [riskScore, setRiskScore] = useState<number>(3);
  const [strategicScore, setStrategicScore] = useState<number>(4);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialProject) {
      setName(initialProject.name);
      setCategory(initialProject.category);
      setInitialInvestment(initialProject.initialInvestment);
      setCashFlows([...initialProject.cashFlows]);
      setDiscountRatePercent(Math.round(initialProject.discountRate * 100));
      setRiskScore(initialProject.riskScore);
      setStrategicScore(initialProject.strategicScore);
      setDescription(initialProject.description);
    } else {
      setName('');
      setCategory('Technology');
      setInitialInvestment(100000);
      setCashFlows([35000, 40000, 45000, 50000]);
      setDiscountRatePercent(10);
      setRiskScore(3);
      setStrategicScore(4);
      setDescription('');
    }
    setErrors({});
  }, [initialProject, isOpen]);

  if (!isOpen) return null;

  // Real-time metric preview
  const liveNPV = calculateNPV(initialInvestment, cashFlows, discountRatePercent / 100);
  const liveIRR = calculateIRR(initialInvestment, cashFlows);
  const livePayback = calculatePaybackPeriod(initialInvestment, cashFlows);

  const handleCashFlowChange = (index: number, value: number) => {
    const updated = [...cashFlows];
    updated[index] = value;
    setCashFlows(updated);
  };

  const addYear = () => {
    if (cashFlows.length < 10) {
      const lastVal = cashFlows[cashFlows.length - 1] || 30000;
      setCashFlows([...cashFlows, lastVal]);
    }
  };

  const removeYear = (index: number) => {
    if (cashFlows.length > 1) {
      setCashFlows(cashFlows.filter((_, i) => i !== index));
    }
  };

  const handleQuickUniformCashFlow = (amount: number) => {
    setCashFlows(cashFlows.map(() => amount));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Project title is required';
    if (initialInvestment <= 0 || isNaN(initialInvestment)) {
      errs.initialInvestment = 'Initial capital must be greater than ₹0';
    }
    if (discountRatePercent <= 0 || discountRatePercent > 50) {
      errs.discountRate = 'Discount rate should be between 1% and 50%';
    }
    if (cashFlows.some(c => isNaN(c))) {
      errs.cashFlows = 'All annual cash flows must be valid numbers';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const project: Project = {
      id: initialProject ? initialProject.id : `proj-${Date.now()}`,
      name: name.trim(),
      category,
      initialInvestment: Number(initialInvestment),
      cashFlows: cashFlows.map(c => Number(c) || 0),
      discountRate: Number(discountRatePercent) / 100,
      riskScore,
      strategicScore,
      description: description.trim() || `${category} capital expenditure initiative.`
    };

    onSave(project);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {initialProject ? 'Edit Investment Project' : 'Add New Candidate Project'}
            </h2>
            <p className="text-xs text-slate-400">Configure capital outlay, lifespan, and cash flow projections</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Calculation Preview Banner */}
        <div className="px-6 py-3 bg-blue-950/30 border-b border-blue-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-300 font-semibold">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Live Financial Estimates:</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-400">NPV: </span>
              <span className={`font-bold ${liveNPV >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(liveNPV)}
              </span>
            </div>
            <div>
              <span className="text-slate-400">IRR: </span>
              <span className="font-bold text-indigo-300">{formatPercent(liveIRR)}</span>
            </div>
            <div>
              <span className="text-slate-400">Payback: </span>
              <span className="font-bold text-amber-300">{livePayback !== null ? `${livePayback} yrs` : '> lifespan'}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Project Name and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Automated Distribution Center"
                className={`w-full px-3.5 py-2 bg-slate-800 border rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
              {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Project['category'])}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Initial Capital & Discount Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Initial Capital Outlay (₹) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-sm">₹</span>
                <input
                  type="number"
                  min="1000"
                  step="5000"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className={`w-full pl-8 pr-3.5 py-2 bg-slate-800 border rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.initialInvestment ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
              </div>
              {errors.initialInvestment && <p className="text-rose-400 text-xs mt-1">{errors.initialInvestment}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hurdle / Discount Rate (%) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="0.5"
                  value={discountRatePercent}
                  onChange={(e) => setDiscountRatePercent(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 text-sm">%</span>
              </div>
              {errors.discountRate && <p className="text-rose-400 text-xs mt-1">{errors.discountRate}</p>}
            </div>
          </div>

          {/* Qualitative Risk & Strategic Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Risk Level (1 = Low, 5 = High)
                </label>
                <span className="text-xs font-bold text-amber-400">Level {riskScore} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={riskScore}
                onChange={(e) => setRiskScore(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Strategic Priority (1 = Low, 5 = High)
                </label>
                <span className="text-xs font-bold text-blue-400">Score {strategicScore} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={strategicScore}
                onChange={(e) => setStrategicScore(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Projected Cash Inflows */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                Annual Projected Cash Inflows (₹)
                <span className="text-slate-400 font-normal">({cashFlows.length} years duration)</span>
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={addYear}
                  disabled={cashFlows.length >= 10}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 text-xs font-medium border border-slate-700 flex items-center gap-1 transition disabled:opacity-50"
                >
                  <Plus className="w-3 h-3" /> Add Year
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {cashFlows.map((cf, index) => (
                <div key={index} className="relative group">
                  <div className="text-[10px] font-semibold text-slate-400 mb-1 flex justify-between items-center">
                    <span>Year {index + 1}</span>
                    {cashFlows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeYear(index)}
                        className="text-slate-500 hover:text-rose-400 transition"
                        title="Remove Year"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-500 text-xs">₹</span>
                    <input
                      type="number"
                      step="1000"
                      value={cf}
                      onChange={(e) => handleCashFlowChange(index, Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
            {errors.cashFlows && <p className="text-rose-400 text-xs mt-1">{errors.cashFlows}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Description / Justification</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key project objectives, cost-reduction mechanisms, or operational impact..."
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {initialProject ? 'Update Project' : 'Save & Evaluate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
