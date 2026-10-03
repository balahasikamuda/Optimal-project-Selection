export function formatCurrency(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  // Compact Indian notation for large figures in badges / graphs
  if (compact) {
    if (abs >= 10000000) { // 1 Crore = 10,000,000
      return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
    }
    if (abs >= 100000) { // 1 Lakh = 100,000
      return `${sign}₹${(abs / 100000).toFixed(1)} L`;
    }
    if (abs >= 1000) {
      return `${sign}₹${(abs / 1000).toFixed(0)}k`;
    }
  }

  // Standard Indian currency formatting (lakh-style grouping)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercent(rate: number | null | undefined): string {
  if (rate === null || rate === undefined || isNaN(rate)) {
    return 'N/A';
  }
  return `${rate >= 0 ? '+' : ''}${rate.toFixed(1)}%`;
}

export function getRiskLabel(risk: number): { label: string; color: string; bg: string } {
  switch (risk) {
    case 1:
      return { label: 'Very Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    case 2:
      return { label: 'Low', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/30' };
    case 3:
      return { label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    case 4:
      return { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' };
    case 5:
      return { label: 'Very High', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
    default:
      return { label: 'Unknown', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' };
  }
}
