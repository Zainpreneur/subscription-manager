import { create } from 'zustand';
import type { Alert } from '../types/budget';
import { alertService } from '../services/alertService';

interface State {
  alerts: Alert[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  unread: () => number;
}

export const useAlertStore = create<State>((set, get) => ({
  alerts: [],
  loading: false,
  fetchAll: async () => {
    set({ loading: true });
    const alerts = await alertService.list();
    set({ alerts, loading: false });
  },
  markRead: async (id) => { await alertService.markRead(id); const alerts = await alertService.list(); set({ alerts }); },
  markAllRead: async () => { await alertService.markAllRead(); const alerts = await alertService.list(); set({ alerts }); },
  remove: async (id) => { await alertService.remove(id); const alerts = await alertService.list(); set({ alerts }); },
  unread: () => get().alerts.filter((a) => !a.read).length,
}));
