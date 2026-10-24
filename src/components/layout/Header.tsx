import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Bell, User } from 'lucide-react';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { Button } from '../ui/Button';

export function Header({ onMenu }: { onMenu: () => void }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const setFilter = useSubscriptionStore((s) => s.setFilter);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ search: q });
    navigate('/subscriptions');
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/60 backdrop-blur flex items-center gap-3 px-4 md:px-6">
      <button onClick={onMenu} className="md:hidden text-slate-400 hover:text-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <form onSubmit={submit} className="flex-1 max-w-xl relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search subscriptions, vendors..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-700 bg-slate-900/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </form>
      <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
      </button>
      <button className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 hover:bg-slate-600">
        <User size={16} />
      </button>
      <Button size="sm" icon={<Plus size={16} />} onClick={() => navigate('/subscriptions?add=1')}>
        Add
      </Button>
    </header>
  );
}
