import type { Budget } from '../types/budget';

const monthsAgo = (n: number) => { const d = new Date(); d.setMonth(d.getMonth()-n); return d.toISOString().slice(0,10); };

export const mockBudgets: Budget[] = [
  { id: 'b1', name: 'Total Monthly Spend', scope: 'global', target: 'all', limit: 500, period: 'monthly', alertThreshold: 80, createdAt: monthsAgo(3) },
  { id: 'b2', name: 'AI Tools Budget', scope: 'category', target: 'AI Tools', limit: 60, period: 'monthly', alertThreshold: 75, createdAt: monthsAgo(2) },
  { id: 'b3', name: 'Cloud Infrastructure', scope: 'category', target: 'Cloud Infrastructure', limit: 200, period: 'monthly', alertThreshold: 90, createdAt: monthsAgo(2) },
  { id: 'b4', name: 'OpenAI Annual Cap', scope: 'service', target: 'OpenAI', limit: 300, period: 'annual', alertThreshold: 85, createdAt: monthsAgo(1) },
];
