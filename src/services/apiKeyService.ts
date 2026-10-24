import type { ApiKey } from '../types/apiKey';
import { mockApiKeys } from './mockApiKeys';

const STORAGE_KEY = 'submgr_apikeys_v1';
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

function load(): ApiKey[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...mockApiKeys];
    return JSON.parse(raw) as ApiKey[];
  } catch {
    return [...mockApiKeys];
  }
}
function save(v: ApiKey[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch {}
}

let keys: ApiKey[] = load();

function mask(key: string) {
  if (key.length <= 8) return '••••••••';
  return key.slice(0, 6) + '••••••••' + key.slice(-4);
}

export const apiKeyService = {
  async list(): Promise<ApiKey[]> { await delay(); return [...keys]; },
  async get(id: string): Promise<ApiKey | null> { await delay(100); return keys.find((k) => k.id === id) ?? null; },
  async create(input: Omit<ApiKey, 'id' | 'createdAt' | 'masked'>): Promise<ApiKey> {
    await delay();
    const k: ApiKey = {
      id: 'key_' + Math.random().toString(36).slice(2, 9),
      masked: mask(input.key),
      createdAt: new Date().toISOString().slice(0, 10),
      ...input,
    };
    keys = [k, ...keys];
    save(keys);
    return k;
  },
  async update(id: string, patch: Partial<ApiKey>): Promise<ApiKey> {
    await delay();
    const idx = keys.findIndex((k) => k.id === id);
    if (idx === -1) throw new Error('Not found');
    const updated = { ...keys[idx], ...patch };
    if (patch.key) updated.masked = mask(patch.key);
    keys = keys.map((k) => (k.id === id ? updated : k));
    save(keys);
    return updated;
  },
  async remove(id: string): Promise<void> {
    await delay();
    keys = keys.filter((k) => k.id !== id);
    save(keys);
  },
  async rotate(id: string, newKey: string): Promise<ApiKey> {
    return this.update(id, { key: newKey, status: 'active', lastUsedAt: new Date().toISOString().slice(0, 10) });
  },
  async reset(): Promise<void> {
    keys = [...mockApiKeys];
    save(keys);
  },
};
