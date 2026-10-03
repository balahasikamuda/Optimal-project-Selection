import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  highlight?: boolean;
  tooltip?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  highlight = false,
  tooltip
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-200 hover:scale-[1.01] ${
        highlight
          ? 'bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950/50 border-blue-500/40 shadow-lg shadow-blue-500/10'
          : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            {title}
            {tooltip && (
              <span className="text-[10px] lowercase text-slate-500 font-normal">({tooltip})</span>
            )}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1.5">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${highlight ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-700/50 text-slate-300'}`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-3.5 pt-3 border-t border-slate-700/50 flex items-center space-x-1.5 text-xs">
          <span
            className={`font-semibold px-1.5 py-0.5 rounded ${
              trend.isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-slate-400">vs total portfolio base</span>
        </div>
      )}
    </div>
  );
};
