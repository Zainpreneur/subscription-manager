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
  create: (input: Parameters<typeof catalogueService.create>[0]) => Promise<CatalogueItem>;
  update: (id: string, patch: Partial<CatalogueItem>) => Promise<CatalogueItem>;
  remove: (id: string) => Promise<void>;
  linkPlan: (itemId: string, planId: string, subscriptionIds?: string[]) => Promise<void>;
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
  create: async (input) => {
    const c = await catalogueService.create(input);
    const items = await catalogueService.list();
    set({ items });
    return c;
  },
  update: async (id, patch) => {
    const c = await catalogueService.update(id, patch);
    const items = await catalogueService.list();
    set({ items });
    return c;
  },
  remove: async (id) => {
    await catalogueService.remove(id);
    const items = await catalogueService.list();
    set({ items });
  },
  linkPlan: async (itemId, planId, subscriptionIds) => {
    await catalogueService.update(itemId, { subscribedPlanId: planId, linkedSubscriptionIds: subscriptionIds });
    const items = await catalogueService.list();
    set({ items });
  },
  unlink: async (itemId) => {
    await catalogueService.update(itemId, { subscribedPlanId: undefined, linkedSubscriptionIds: undefined });
    const items = await catalogueService.list();
    set({ items });
  },
}));
