import type { Alert } from '../types/alert';

const KEY = 'submgr_alerts_v1';
const delay = (ms=120) => new Promise(r=>setTimeout(r,ms));
function load(): Alert[] {
  try {
    const r = localStorage.getItem(KEY);
    if (!r) return seed();
    return JSON.parse(r);
  } catch { return seed(); }
}
function seed(): Alert[] {
  const now = new Date().toISOString().slice(0,10);
  return [
    { id:'al1', type:'renewal', severity:'warning', title:'Renewal in 3 days', message:'AWS renews on ' + now + ' for $142.50.', read:false, createdAt:now, link:'/subscriptions' },
    { id:'al2', type:'budget', severity:'critical', title:'Budget exceeded', message:'AI Tools spend exceeded 100% of monthly cap.', read:false, createdAt:now, link:'/budgets' },
    { id:'al3', type:'expiry', severity:'warning', title:'API key expiring', message:'OpenAI Production key expires in 60 days.', read:true, createdAt:now, link:'/api-keys' },
    { id:'al4', type:'system', severity:'info', title:'Trial key auto-paused', message:'Mailchimp Trial key was auto-paused after expiry.', read:false, createdAt:now, link:'/api-keys' },
  ];
}
function save(v:Alert[]){ try{localStorage.setItem(KEY,JSON.stringify(v));}catch{} }
let alerts: Alert[] = load();

export const alertService = {
  async list(){ await delay(); return [...alerts].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)); },
  async unreadCount(){ await delay(50); return alerts.filter(a=>!a.read).length; },
  async create(input: Omit<Alert,'id'|'createdAt'|'read'>){ await delay(); const a:Alert={id:'alt_'+Math.random().toString(36).slice(2,8), createdAt:new Date().toISOString().slice(0,10), read:false, ...input}; alerts=[a,...alerts]; save(alerts); return a; },
  async markRead(id:string){ await delay(60); alerts=alerts.map(a=>a.id===id?{...a,read:true}:a); save(alerts); },
  async markAllRead(){ await delay(60); alerts=alerts.map(a=>({...a,read:true})); save(alerts); },
  async remove(id:string){ await delay(60); alerts=alerts.filter(a=>a.id!==id); save(alerts); },
  async reset(){ alerts=seed(); save(alerts); },
};
