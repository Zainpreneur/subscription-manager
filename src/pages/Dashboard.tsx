import { useEffect } from 'react';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { formatCurrency, monthlyCost, daysUntil, statusColor, typeColor } from '../lib/utils';
import { DollarSign, CreditCard, Gift, CalendarClock, TrendingUp } from 'lucide-react';

function MetricCard({ title, value, sub, icon, accent }: { title: string; value: string; sub?: string; icon: React.ReactNode; accent: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent}`}>{icon}</div>
      </div>
    </Card>
  );
}

export function Dashboard() {
  const { subscriptions, activity, loading, fetchAll } = useSubscriptionStore();
  useEffect(() => { fetchAll(); }, [fetchAll]);

  const activePaid = subscriptions.filter((s) => s.status === 'active' && s.type === 'paid');
  const freeServices = subscriptions.filter((s) => s.type === 'free' || s.type === 'lifetime');
  const monthlySpend = activePaid.reduce((acc, s) => acc + monthlyCost(s), 0);
  const annualSpend = monthlySpend * 12;
  const upcoming = subscriptions
    .filter((s) => s.status === 'active' && daysUntil(s.renewalDate) >= 0 && daysUntil(s.renewalDate) <= 14)
    .sort((a, b) => daysUntil(a.renewalDate) - daysUntil(b.renewalDate));

  const topExpenses = [...activePaid].sort((a, b) => monthlyCost(b) - monthlyCost(a)).slice(0, 6);

  if (loading && subscriptions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0,1,2,3].map((i) => <Card key={i} className="p-5"><Skeleton className="h-4 w-24 mb-3" /><Skeleton className="h-8 w-32" /></Card>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-5"><Skeleton className="h-4 w-32 mb-4" />{[0,1,2,3,4].map((i) => <Skeleton key={i} className="h-8 mb-3" />)}</Card>
          <Card className="p-5"><Skeleton className="h-4 w-32 mb-4" />{[0,1,2,3].map((i) => <Skeleton key={i} className="h-8 mb-3" />)}</Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Your subscription overview at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Monthly Spend" value={formatCurrency(monthlySpend)} sub="Active paid subscriptions" icon={<DollarSign size={20} className="text-white" />} accent="bg-indigo-600" />
        <MetricCard title="Annual Spend" value={formatCurrency(annualSpend)} sub="Projected yearly" icon={<TrendingUp size={20} className="text-white" />} accent="bg-violet-600" />
        <MetricCard title="Active Paid" value={String(activePaid.length)} sub="Paying services" icon={<CreditCard size={20} className="text-white" />} accent="bg-emerald-600" />
        <MetricCard title="Free / Lifetime" value={String(freeServices.length)} sub="No recurring cost" icon={<Gift size={20} className="text-white" />} accent="bg-teal-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-semibold text-white">Top Expenses</h2>
            <span className="text-xs text-slate-500">Monthly</span>
          </div>
          <CardBody>
            <div className="space-y-3">
              {topExpenses.map((s) => {
                const pct = monthlySpend > 0 ? (monthlyCost(s) / monthlySpend) * 100 : 0;
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-lg">{s.logo || '📦'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white truncate">{s.name}</span>
                        <span className="text-sm text-slate-300">{formatCurrency(monthlyCost(s))}</span>
                      </div>
                      <div className="mt-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card>
          <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
            <CalendarClock size={16} className="text-amber-400" />
            <h2 className="font-semibold text-white">Upcoming Renewals</h2>
          </div>
          <CardBody>
            <div className="space-y-3">
              {upcoming.length === 0 && <p className="text-sm text-slate-500">No renewals in the next 14 days.</p>}
              {upcoming.map((s) => {
                const d = daysUntil(s.renewalDate);
                return (
                  <div key={s.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">{s.logo || '📦'}</span>
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{s.name}</p>
                        <p className="text-xs text-slate-500">{d === 0 ? 'Today' : `in ${d} day${d > 1 ? 's' : ''}`}</p>
                      </div>
                    </div>
                    <span className="text-sm text-slate-300">{formatCurrency(s.cost)}</span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="px-5 py-4 border-b border-slate-800">
            <h2 className="font-semibold text-white">Recent Activity</h2>
          </div>
          <CardBody>
            <div className="space-y-3">
              {activity.slice(0, 8).map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="h-2 w-2 mt-2 rounded-full bg-indigo-500" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">{a.message}</p>
                    <p className="text-xs text-slate-500">{a.date}</p>
                  </div>
                </div>
              ))}
              {activity.length === 0 && <p className="text-sm text-slate-500">No activity yet.</p>}
            </div>
          </CardBody>
        </Card>

        <Card>
          <div className="px-5 py-4 border-b border-slate-800">
            <h2 className="font-semibold text-white">Status Breakdown</h2>
          </div>
          <CardBody>
            <div className="space-y-2">
              {(['active', 'paused', 'cancelled'] as const).map((st) => {
                const count = subscriptions.filter((s) => s.status === st).length;
                const pct = subscriptions.length ? (count / subscriptions.length) * 100 : 0;
                return (
                  <div key={st} className="flex items-center gap-3">
                    <Badge className={statusColor(st)}>{st}</Badge>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-400 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500">By type</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {(['paid', 'free', 'lifetime', 'trial'] as const).map((t) => (
                  <Badge key={t} className={typeColor(t)}>{t}: {subscriptions.filter((s) => s.type === t).length}</Badge>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
