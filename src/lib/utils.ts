import { format, differenceInDays, parseISO, isAfter, isBefore, addDays } from 'date-fns';

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
}

export function monthlyCost(sub: { cost: number; billingCycle: string }): number {
  switch (sub.billingCycle) {
    case 'weekly':
      return sub.cost * 4.33;
    case 'monthly':
      return sub.cost;
    case 'quarterly':
      return sub.cost / 3;
    case 'annual':
      return sub.cost / 12;
    case 'one-time':
      return 0;
    default:
      return sub.cost;
  }
}

export function annualCost(sub: { cost: number; billingCycle: string }): number {
  return monthlyCost(sub) * 12;
}

export function daysUntil(dateStr: string): number {
  try {
    return differenceInDays(parseISO(dateStr), new Date());
  } catch {
    return 0;
  }
}

export function formatDate(dateStr: string, fmt = 'MMM d, yyyy') {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

export function isUpcoming(dateStr: string, days = 14) {
  const d = parseISO(dateStr);
  const now = new Date();
  return isAfter(d, now) && isBefore(d, addDays(now, days));
}

export function statusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'paused':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'cancelled':
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    default:
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
}

export function typeColor(type: string) {
  switch (type) {
    case 'paid':
      return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
    case 'free':
      return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
    case 'lifetime':
      return 'bg-violet-500/15 text-violet-400 border-violet-500/30';
    case 'trial':
      return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    default:
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
}
