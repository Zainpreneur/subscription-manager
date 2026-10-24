import { create } from 'zustand';
import type { ApiKey } from '../types/apiKey';
import { apiKeyService } from '../services/apiKeyService';

interface Filters { search: string; service: string; status: string; environment: string; type: string; }
interface State {
  keys: ApiKey[];
  loading: boolean;
  error: string | null;
  filters: Filters;
  view: 'card' | 'list' | 'table';
  fetchAll: () => Promise<void>;
  add: (input: Parameters<typeof apiKeyService.create>[0]) => Promise<ApiKey>;
  update: (id: string, patch: Partial<ApiKey>) => Promise<ApiKey>;
  remove: (id: string) => Promise<void>;
  rotate: (id: string, newKey: string) => Promise<ApiKey>;
  setFilter: (p: Partial<Filters>) => void;
  resetFilters: () => void;
  setView: (v: 'card' | 'list' | 'table') => void;
}

export const useApiKeyStore = create<State>((set, get) => ({
  keys: [],
  loading: false,
  error: null,
  filters: { search: '', service: 'all', status: 'all', environment: 'all', type: 'all' },
  view: 'table',
  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const keys = await apiKeyService.list();
      set({ keys, loading: false });
    } catch (e) { set({ error: (e as Error).message, loading: false }); }
  },
  add: async (input) => {
    const k = await apiKeyService.create(input);
    const keys = await apiKeyService.list();
    set({ keys });
    return k;
  },
  update: async (id, patch) => {
    const k = await apiKeyService.update(id, patch);
    const keys = await apiKeyService.list();
    set({ keys });
    return k;
  },
  remove: async (id) => {
    await apiKeyService.remove(id);
    const keys = await apiKeyService.list();
    set({ keys });
  },
  rotate: async (id, newKey) => {
    const k = await apiKeyService.rotate(id, newKey);
    const keys = await apiKeyService.list();
    set({ keys });
    return k;
  },
  setFilter: (p) => set({ filters: { ...get().filters, ...p } }),
  resetFilters: () => set({ filters: { search: '', service: 'all', status: 'all', environment: 'all', type: 'all' } }),
  setView: (v) => set({ view: v }),
}));
