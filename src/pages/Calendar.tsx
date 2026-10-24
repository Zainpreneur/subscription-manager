import { useEffect, useMemo, useState } from 'react';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, isToday } from 'date-fns';

export function CalendarPage() {
  const store = useSubscriptionStore();
  useEffect(() => { store.fetchAll(); }, []);
  const [current, setCurrent] = useState(() => new Date());

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // pad to week grid
  const startWeekday = monthStart.getDay(); // 0 sun
  const pad = Array.from({ length: startWeekday });

  const renewalsByDay = useMemo(() => {
    const map: Record<string, typeof store.subscriptions> = {};
    store.subscriptions.forEach((s) => {
      const key = s.renewalDate;
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });
    return map;
  }, [store.subscriptions]);

  const upcoming = store.subscriptions
    .filter((s) => s.status === 'active')
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
    .slice(0, 12);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Renewal Calendar</h1>
        <p className="text-sm text-slate-400 mt-1">Track upcoming renewal dates.</p>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrent(subMonths(current, 1))} className="p-2 text-slate-400 hover:text-white rounded hover:bg-slate-800"><ChevronLeft size={18} /></button>
          <h2 className="text-lg font-semibold text-white">{format(current, 'MMMM yyyy')}</h2>
          <button onClick={() => setCurrent(addMonths(current, 1))} className="p-2 text-slate-400 hover:text-white rounded hover:bg-slate-800"><ChevronRight size={18} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d} className="py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {pad.map((_, i) => <div key={'pad' + i} />)}
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const items = renewalsByDay[key] || [];
            return (
              <div
                key={key}
                className={`min-h-[70px] rounded-lg border p-1.5 text-xs ${isToday(day) ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/40'} ${!isSameMonth(day, current) ? 'opacity-40' : ''}`}
              >
                <div className={`font-medium ${isToday(day) ? 'text-indigo-300' : 'text-slate-300'}`}>{format(day, 'd')}</div>
                <div className="mt-1 space-y-0.5">
                  {items.slice(0, 2).map((s) => (
                    <div key={s.id} className="truncate rounded px-1 py-0.5 bg-indigo-600/30 text-indigo-200 text-[10px]">
                      {s.logo} {s.name}
                    </div>
                  ))}
                  {items.length > 2 && <div className="text-[10px] text-slate-500">+{items.length - 2} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="font-semibold text-white">Upcoming Renewals</h2>
        </div>
        <div className="divide-y divide-slate-800">
          {upcoming.map((s) => (
            <div key={s.id} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{s.logo || '📦'}</span>
                <div>
                  <p className="text-sm text-white">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.renewalDate}</p>
                </div>
              </div>
              <span className="text-sm text-slate-300">{formatCurrency(s.cost)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
