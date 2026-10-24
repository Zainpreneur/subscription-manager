import type { CatalogueItem } from '../types/softwareCatalogue';
import { mockCatalogue } from './mockCatalogue';

const KEY = 'submgr_catalogue_v1';
const delay = (ms=150) => new Promise(r=>setTimeout(r,ms));
function load(): CatalogueItem[] { try { const r=localStorage.getItem(KEY); if(!r) return [...mockCatalogue]; return JSON.parse(r); } catch { return [...mockCatalogue]; } }
function save(v:CatalogueItem[]){ try{localStorage.setItem(KEY,JSON.stringify(v));}catch{} }
let items: CatalogueItem[] = load();

export const catalogueService = {
  async list(){ await delay(); return [...items]; },
  async get(id:string){ await delay(80); return items.find(i=>i.id===id)??null; },
  async update(id:string, patch:Partial<CatalogueItem>){ await delay(); const idx=items.findIndex(i=>i.id===id); if(idx===-1) throw new Error('Not found'); const u={...items[idx],...patch}; items=items.map(i=>i.id===id?u:i); save(items); return u; },
  async reset(){ items=[...mockCatalogue]; save(items); },
};
