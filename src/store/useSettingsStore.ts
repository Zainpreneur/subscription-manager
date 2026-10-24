import { create } from 'zustand';
import type { Settings } from '../types/subscription';

const KEY = 'submgr_settings_v1';
const defaults: Settings = { currency: 'USD', theme: 'dark', notifications: true, reminderDays: 7 };

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export const useSettingsStore = create<{ settings: Settings; update: (p: Partial<Settings>) => void }>((set, get) => ({
  settings: load(),
  update: (p) => {
    const next = { ...get().settings, ...p };
    localStorage.setItem(KEY, JSON.stringify(next));
    set({ settings: next });
  },
}));
