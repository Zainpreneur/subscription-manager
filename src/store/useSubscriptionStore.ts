import { create } from 'zustand';
import type { Subscription, ActivityEntry } from '../types/subscription';
import { subscriptionService } from '../services/subscriptionService';

interface Filters {
  search: string;
  category: string;
  type: string;
  status: string;
}

interface SubState {
  subscriptions: Subscription[];
  activity: ActivityEntry[];
  loading: boolean;
  error: string | null;
  filters: Filters;
  view: 'card' | 'list' | 'table' | 'gallery' | 'kanban' | 'timeline';
  fetchAll: () => Promise<void>;
  add: (input: Parameters<typeof subscriptionService.create>[0]) => Promise<Subscription>;
  update: (id: string, patch: Partial<Subscription>) => Promise<Subscription>;
  remove: (id: string) => Promise<void>;
  setFilter: (patch: Partial<Filters>) => void;
  resetFilters: () => void;
  setView: (v: 'card' | 'list' | 'table' | 'gallery' | 'kanban' | 'timeline') => void;
  resetData: () => Promise<void>;
}

export const useSubscriptionStore = create<SubState>((set, get) => ({
  subscriptions: [],
  activity: [],
  loading: false,
  error: null,
  filters: { search: '', category: 'all', type: 'all', status: 'all' },
  view: 'card',
  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const [subscriptions, activity] = await Promise.all([
        subscriptionService.list(),
        subscriptionService.listActivity(),
      ]);
      set({ subscriptions, activity, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },
  add: async (input) => {
    const sub = await subscriptionService.create(input);
    const [subscriptions, activity] = await Promise.all([
      subscriptionService.list(),
      subscriptionService.listActivity(),
    ]);
    set({ subscriptions, activity });
    return sub;
  },
  update: async (id, patch) => {
    const sub = await subscriptionService.update(id, patch);
    const [subscriptions, activity] = await Promise.all([
      subscriptionService.list(),
      subscriptionService.listActivity(),
    ]);
    set({ subscriptions, activity });
    return sub;
  },
  remove: async (id) => {
    await subscriptionService.remove(id);
    const [subscriptions, activity] = await Promise.all([
      subscriptionService.list(),
      subscriptionService.listActivity(),
    ]);
    set({ subscriptions, activity });
  },
  setFilter: (patch) => set({ filters: { ...get().filters, ...patch } }),
  resetFilters: () => set({ filters: { search: '', category: 'all', type: 'all', status: 'all' } }),
  setView: (v) => set({ view: v }),
  resetData: async () => {
    await subscriptionService.reset();
    await get().fetchAll();
  },
}));
