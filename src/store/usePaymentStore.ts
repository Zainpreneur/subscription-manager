import { create } from 'zustand';
import type { PaymentMethod } from '../types/payment';

const KEY = 'submgr_payments_v1';
const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));
function load(): PaymentMethod[] {
  try {
    const r = localStorage.getItem(KEY);
    if (!r) return [
      { id: 'pm1', label: 'Visa •••• 4242', type: 'card', last4: '4242', expiry: '12/28', holder: 'Alex', isDefault: true },
      { id: 'pm2', label: 'Mastercard •••• 8888', type: 'card', last4: '8888', expiry: '09/27', holder: 'Alex', isDefault: false },
    ];
    return JSON.parse(r);
  } catch { return []; }
}
function save(v: PaymentMethod[]) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} }

interface State {
  methods: PaymentMethod[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  add: (m: Omit<PaymentMethod, 'id'>) => Promise<PaymentMethod>;
  update: (id: string, patch: Partial<PaymentMethod>) => Promise<PaymentMethod>;
  remove: (id: string) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
}

export const usePaymentStore = create<State>((set, get) => ({
  methods: [],
  loading: false,
  fetchAll: async () => {
    set({ loading: true });
    await delay();
    set({ methods: load(), loading: false });
  },
  add: async (m) => {
    await delay();
    const method: PaymentMethod = { id: 'pm_' + Math.random().toString(36).slice(2, 8), ...m };
    const methods = [...get().methods, method];
    if (method.isDefault) methods.forEach((x) => { if (x.id !== method.id) x.isDefault = false; });
    save(methods);
    set({ methods });
    return method;
  },
  update: async (id, patch) => {
    await delay();
    const methods = get().methods.map((m) => (m.id === id ? { ...m, ...patch } : m));
    save(methods);
    set({ methods });
    return methods.find((m) => m.id === id)!;
  },
  remove: async (id) => {
    await delay();
    const methods = get().methods.filter((m) => m.id !== id);
    save(methods);
    set({ methods });
  },
  setDefault: async (id) => {
    await delay();
    const methods = get().methods.map((m) => ({ ...m, isDefault: m.id === id }));
    save(methods);
    set({ methods });
  },
}));
