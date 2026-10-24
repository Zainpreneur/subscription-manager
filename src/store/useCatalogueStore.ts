import { create } from 'zustand';
import type { CatalogueItem } from '../types/softwareCatalogue';
import { catalogueService } from '../services/catalogueService';

interface State {
  items: CatalogueItem[];
  loading: boolean;
  search: string;
  category: string;
  fetchAll: () => Promise<void>;
  setSearch: (s: string) => void;
  setCategory: (c: string) => void;
  linkPlan: (itemId: string, planId: string, subscriptionId?: string) => Promise<void>;
  unlink: (itemId: string) => Promise<void>;
}

export const useCatalogueStore = create<State>((set) => ({
  items: [],
  loading: false,
  search: '',
  category: 'all',
  fetchAll: async () => {
    set({ loading: true });
    const items = await catalogueService.list();
    set({ items, loading: false });
  },
  setSearch: (s) => set({ search: s }),
  setCategory: (c) => set({ category: c }),
  linkPlan: async (itemId, planId, subscriptionId) => {
    await catalogueService.update(itemId, { subscribedPlanId: planId, linkedSubscriptionId: subscriptionId });
    const items = await catalogueService.list();
    set({ items });
  },
  unlink: async (itemId) => {
    await catalogueService.update(itemId, { subscribedPlanId: undefined, linkedSubscriptionId: undefined });
    const items = await catalogueService.list();
    set({ items });
  },
}));
