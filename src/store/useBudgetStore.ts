import { create } from 'zustand';
import type { Budget } from '../types/budget';
import { budgetService } from '../services/budgetService';
import { useSubscriptionStore } from './useSubscriptionStore';

import { alertService } from '../services/alertService';

interface State {
  budgets: Budget[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  add: (input: Parameters<typeof budgetService.create>[0]) => Promise<Budget>;
  update: (id: string, patch: Partial<Budget>) => Promise<Budget>;
  remove: (id: string) => Promise<void>;
  spendFor: (b: Budget) => number;
  evaluate: () => Promise<void>;
}

export const useBudgetStore = create<State>((set, get) => ({
  budgets: [],
  loading: false,
  fetchAll: async () => {
    set({ loading: true });
    const budgets = await budgetService.list();
    set({ budgets, loading: false });
    await get().evaluate();
  },
  add: async (input) => {
    const b = await budgetService.create(input);
    const budgets = await budgetService.list();
    set({ budgets });
    await get().evaluate();
    return b;
  },
  update: async (id, patch) => {
    const b = await budgetService.update(id, patch);
    const budgets = await budgetService.list();
    set({ budgets });
    await get().evaluate();
    return b;
  },
  remove: async (id) => {
    await budgetService.remove(id);
    const budgets = await budgetService.list();
    set({ budgets });
  },
  spendFor: (b) => {
    const subs = useSubscriptionStore.getState().subscriptions;
    const activePaid = subs.filter((s) => s.status === 'active' && s.type === 'paid');
    const monthly = (s: any) => {
      switch (s.billingCycle) {
        case 'weekly': return s.cost * 4.33;
        case 'monthly': return s.cost;
        case 'quarterly': return s.cost / 3;
        case 'annual': return s.cost / 12;
        default: return s.cost;
      }
    };
    let spend = 0;
    if (b.scope === 'global') {
      spend = activePaid.reduce((a, s) => a + monthly(s), 0);
      if (b.period === 'annual') spend *= 12;
    } else if (b.scope === 'category') {
      spend = activePaid.filter((s) => s.category === b.target).reduce((a, s) => a + monthly(s), 0);
      if (b.period === 'annual') spend *= 12;
    } else if (b.scope === 'service') {
      spend = activePaid.filter((s) => s.vendor === b.target || s.name === b.target).reduce((a, s) => a + monthly(s), 0);
      if (b.period === 'annual') spend *= 12;
    }
    return Math.round(spend * 100) / 100;
  },
  evaluate: async () => {
    const budgets = get().budgets;
    for (const b of budgets) {
      const spend = get().spendFor(b);
      const pct = (spend / b.limit) * 100;
      if (pct >= 100) {
        await alertService.create({ type: 'budget', severity: 'critical', title: `Budget exceeded: ${b.name}`, message: `Spend ${spend.toFixed(2)} exceeds limit ${b.limit.toFixed(2)} (${Math.round(pct)}%).`, link: '/budgets' });
      } else if (pct >= b.alertThreshold) {
        await alertService.create({ type: 'budget', severity: 'warning', title: `Budget nearing limit: ${b.name}`, message: `Spend ${spend.toFixed(2)} of ${b.limit.toFixed(2)} (${Math.round(pct)}%).`, link: '/budgets' });
      }
    }
  },
}));
