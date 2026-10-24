import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command } from 'lucide-react';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';

const routes = [
  { path: '/', label: 'Dashboard', hint: 'Overview' },
  { path: '/subscriptions', label: 'Subscriptions', hint: 'Manage' },
  { path: '/calendar', label: 'Renewal Calendar', hint: 'Schedule' },
  { path: '/analytics', label: 'Analytics & Spend', hint: 'Insights' },
  { path: '/settings', label: 'Settings', hint: 'Preferences' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const subs = useSubscriptionStore((s) => s.subscriptions);
  const fetchAll = useSubscriptionStore((s) => s.fetchAll);
  useEffect(() => {
    if (subs.length === 0) fetchAll();
  }, [subs.length, fetchAll]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!open) return null;

  const filteredRoutes = routes.filter((r) => r.label.toLowerCase().includes(q.toLowerCase()));
  const filteredSubs = q
    ? subs.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.vendor.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
    setQ('');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
          <Search size={16} className="text-slate-500" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pages or subscriptions..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {filteredRoutes.length > 0 && (
            <div>
              <p className="px-4 py-1 text-[10px] uppercase tracking-wider text-slate-500">Pages</p>
              {filteredRoutes.map((r) => (
                <button key={r.path} onClick={() => go(r.path)} className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 transition">
                  <span>{r.label}</span>
                  <span className="text-xs text-slate-500">{r.hint}</span>
                </button>
              ))}
            </div>
          )}
          {filteredSubs.length > 0 && (
            <div>
              <p className="px-4 py-1 text-[10px] uppercase tracking-wider text-slate-500">Subscriptions</p>
              {filteredSubs.map((s) => (
                <button key={s.id} onClick={() => go(`/subscriptions/${s.id}`)} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 transition">
                  <span>{s.logo || '📦'}</span>
                  <span className="flex-1 text-left truncate">{s.name}</span>
                  <span className="text-xs text-slate-500">{s.vendor}</span>
                </button>
              ))}
            </div>
          )}
          {filteredRoutes.length === 0 && filteredSubs.length === 0 && (
            <p className="px-4 py-6 text-sm text-slate-500 text-center">No results.</p>
          )}
        </div>
        <div className="px-4 py-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center gap-2">
          <Command size={10} /> Ctrl/⌘+K to toggle
        </div>
      </div>
    </div>
  );
}
