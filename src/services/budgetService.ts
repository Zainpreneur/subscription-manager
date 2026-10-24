import type { Budget } from '../types/budget';
import { mockBudgets } from './mockBudgets';

const KEY = 'submgr_budgets_v1';
const delay = (ms=150) => new Promise(r=>setTimeout(r,ms));
function load(): Budget[] { try { const r=localStorage.getItem(KEY); if(!r) return [...mockBudgets]; return JSON.parse(r); } catch { return [...mockBudgets]; } }
function save(v:Budget[]){ try{localStorage.setItem(KEY,JSON.stringify(v));}catch{} }
let budgets: Budget[] = load();

export const budgetService = {
  async list(){ await delay(); return [...budgets]; },
  async get(id:string){ await delay(80); return budgets.find(b=>b.id===id)??null; },
  async create(input: Omit<Budget,'id'|'createdAt'>){ await delay(); const b:Budget={id:'bud_'+Math.random().toString(36).slice(2,8), createdAt:new Date().toISOString().slice(0,10), ...input}; budgets=[b,...budgets]; save(budgets); return b; },
  async update(id:string, patch:Partial<Budget>){ await delay(); const idx=budgets.findIndex(b=>b.id===id); if(idx===-1) throw new Error('Not found'); const u={...budgets[idx],...patch}; budgets=budgets.map(b=>b.id===id?u:b); save(budgets); return u; },
  async remove(id:string){ await delay(); budgets=budgets.filter(b=>b.id!==id); save(budgets); },
  async reset(){ budgets=[...mockBudgets]; save(budgets); },
};
