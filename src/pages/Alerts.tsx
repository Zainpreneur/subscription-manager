import { useEffect, useState } from 'react';
import { useAlertStore } from '../store/useAlertStore';
import { useToastStore } from '../store/useToastStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Check, Trash2, Mail } from 'lucide-react';
import type { Alert } from '../types/alert';

const sevColor = (s: Alert['severity']) => {
  switch (s) {
    case 'critical': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    case 'warning': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'info': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  }
};
const typeIcon = (t: Alert['type']) => {
  switch (t) { case 'budget': return '💰'; case 'renewal': return '📅'; case 'expiry': return '🔑'; case 'system': return '⚙️'; }
};

export function AlertsPage() {
  const store = useAlertStore();
  const toast = useToastStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => { store.fetchAll(); }, []);

  const alerts = filter === 'unread' ? store.alerts.filter((a) => !a.read) : store.alerts;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Mail className="text-indigo-400" /> Alerts</h1>
          <p className="text-sm text-slate-400 mt-1">In-app notifications (email-style) for renewals, budgets, and keys.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-700 overflow-hidden">
            <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-xs ${filter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>All</button>
            <button onClick={() => setFilter('unread')} className={`px-3 py-1.5 text-xs ${filter === 'unread' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>Unread ({store.alerts.filter(a=>!a.read).length})</button>
          </div>
          <Button variant="ghost" size="sm" icon={<Check size={14} />} onClick={async () => { await store.markAllRead(); toast.show('All marked read', 'info'); }}>Mark all read</Button>
        </div>
      </div>

      {store.loading && store.alerts.length === 0 ? (
        <Card className="p-5">{[0,1,2,3].map(i => <Skeleton key={i} className="h-16 mb-3" />)}</Card>
      ) : alerts.length === 0 ? (
        <EmptyState title="No alerts" description="You're all caught up." />
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <Card key={a.id} className={`p-4 ${a.read ? 'opacity-70' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">{typeIcon(a.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">{a.title}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${sevColor(a.severity)}`}>{a.severity}</span>
                    {!a.read && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{a.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{a.createdAt} · {a.type}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!a.read && <button onClick={() => store.markRead(a.id)} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800" title="Mark read"><Check size={14} /></button>}
                  <button onClick={() => store.remove(a.id)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800" title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
