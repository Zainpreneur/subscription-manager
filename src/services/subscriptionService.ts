import type { Subscription, ActivityEntry } from '../types/subscription';
import { mockSubscriptions, mockActivity } from './mockData';

const STORAGE_KEY = 'submgr_subscriptions_v1';
const ACTIVITY_KEY = 'submgr_activity_v1';
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

let subs: Subscription[] = load(STORAGE_KEY, mockSubscriptions);
let acts: ActivityEntry[] = load(ACTIVITY_KEY, mockActivity);

function persist() {
  save(STORAGE_KEY, subs);
  save(ACTIVITY_KEY, acts);
}

export const subscriptionService = {
  async list(): Promise<Subscription[]> {
    await delay();
    return [...subs];
  },
  async get(id: string): Promise<Subscription | null> {
    await delay(150);
    return subs.find((s) => s.id === id) ?? null;
  },
  async create(input: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt' | 'costHistory' | 'invoices'> & Partial<Pick<Subscription, 'costHistory' | 'invoices'>>): Promise<Subscription> {
    await delay();
    const now = new Date().toISOString().slice(0, 10);
    const sub: Subscription = {
      id: 'sub_' + Math.random().toString(36).slice(2, 9),
      costHistory: [],
      invoices: [],
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    subs = [sub, ...subs];
    acts = [{ id: 'act_' + Date.now(), type: 'created', subscriptionId: sub.id, subscriptionName: sub.name, message: `${sub.name} added`, date: now }, ...acts];
    persist();
    return sub;
  },
  async update(id: string, patch: Partial<Subscription>): Promise<Subscription> {
    await delay();
    const idx = subs.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Not found');
    const updated = { ...subs[idx], ...patch, updatedAt: new Date().toISOString().slice(0, 10) };
    subs = subs.map((s) => (s.id === id ? updated : s));
    acts = [{ id: 'act_' + Date.now(), type: 'updated', subscriptionId: id, subscriptionName: updated.name, message: `${updated.name} updated`, date: updated.updatedAt }, ...acts];
    persist();
    return updated;
  },
  async remove(id: string): Promise<void> {
    await delay();
    const s = subs.find((x) => x.id === id);
    subs = subs.filter((x) => x.id !== id);
    if (s) acts = [{ id: 'act_' + Date.now(), type: 'cancelled', subscriptionId: id, subscriptionName: s.name, message: `${s.name} deleted`, date: new Date().toISOString().slice(0, 10) }, ...acts];
    persist();
  },
  async listActivity(): Promise<ActivityEntry[]> {
    await delay(100);
    return [...acts];
  },
  async reset(): Promise<void> {
    subs = [...mockSubscriptions];
    acts = [...mockActivity];
    persist();
  },
};
