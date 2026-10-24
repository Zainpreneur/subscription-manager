import { useEffect } from 'react';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { DonutChart } from '../components/ui/DonutChart';
import { formatCurrency, monthlyCost } from '../lib/utils';
import { BarChart3 } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#84cc16', '#64748b'];

export function Analytics() {
  const store = useSubscriptionStore();
  useEffect(() => { store.fetchAll(); }, []);
  const subs = store.subscriptions;
  const activePaid = subs.filter((s) => s.status === 'active' && s.type === 'paid');

  const totalMonthly = activePaid.reduce((a, s) => a + monthlyCost(s), 0);
  const totalAnnual = totalMonthly * 12;

  // category breakdown
  const byCategory: Record<string, number> = {};
  activePaid.forEach((s) => {
    byCategory[s.category] = (byCategory[s.category] || 0) + monthlyCost(s);
  });
  const catEntries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...catEntries.map(([, v]) => v), 1);

  // type breakdown
  const byType: Record<string, number> = {};
  subs.forEach((s) => { byType[s.type] = (byType[s.type] || 0) + 1; });

  // top vendors
  const byVendor: Record<string, number> = {};
  activePaid.forEach((s) => { byVendor[s.vendor] = (byVendor[s.vendor] || 0) + monthlyCost(s); });
  const topVendors = Object.entries(byVendor).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // mock monthly trend (last 6 months) derived
  // oxlint-disable-next-line react/purity
  const trendBase = new Date();
  const trend = Array.from({ length: 6 }).map((_, i) => {
    const month = new Date(trendBase);
    month.setMonth(month.getMonth() - (5 - i));
    const label = month.toLocaleString('default', { month: 'short' });
    const base = totalMonthly;
    const factor = 0.85 + i * 0.03 + (i % 2 ? 0.02 : 0);
    return { label, value: Math.round(base * factor * 100) / 100 };
  });

  const maxTrend = Math.max(...trend.map((t) => t.value), 1);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics & Spend</h1>
        <p className="text-sm text-slate-400 mt-1">Categorized spending breakdown and projections.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-xs text-slate-400">Total Monthly</p>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalMonthly)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-slate-400">Total Annual</p>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalAnnual)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-slate-400">Avg per Subscription</p>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(activePaid.length ? totalMonthly / activePaid.length : 0)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><h2 className="font-semibold text-white flex items-center gap-2"><BarChart3 size={16} className="text-indigo-400" /> Spend by Category</h2></CardHeader>
          <CardBody className="space-y-4">
            <DonutChart data={catEntries.map(([cat, val], i) => ({ label: cat, value: val, color: COLORS[i % COLORS.length] }))} />
            {catEntries.map(([cat, val], i) => (
              <div key={cat}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-300">{cat}</span>
                  <span className="text-white font-medium">{formatCurrency(val)} <span className="text-xs text-slate-500">({Math.round((val / totalMonthly) * 100)}%)</span></span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(val / maxCat) * 100}%`, background: COLORS[i % COLORS.length] }} />
                </div>
              </div>
            ))}
            {catEntries.length === 0 && <p className="text-sm text-slate-500">No data.</p>}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold text-white">Monthly Trend (last 6 months)</h2></CardHeader>
          <CardBody>
            <div className="flex items-end gap-3 h-48">
              {trend.map((t) => (
                <div key={t.label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                    <div className="w-full max-w-[40px] bg-indigo-500/80 rounded-t-md transition-all" style={{ height: `${(t.value / maxTrend) * 100}%` }} />
                  </div>
                  <span className="text-xs text-slate-400">{t.label}</span>
                  <span className="text-[10px] text-slate-500">{formatCurrency(t.value)}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><h2 className="font-semibold text-white">Top Vendors by Spend</h2></CardHeader>
          <CardBody className="space-y-2">
            {topVendors.map(([v, val], i) => (
              <div key={v} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-5">{i + 1}</span>
                  <span className="text-sm text-white">{v}</span>
                </div>
                <span className="text-sm font-medium text-slate-300">{formatCurrency(val)}</span>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold text-white">Distribution by Type</h2></CardHeader>
          <CardBody className="space-y-3">
            {Object.entries(byType).map(([t, count]) => {
              const pct = subs.length ? (count / subs.length) * 100 : 0;
              return (
                <div key={t} className="flex items-center gap-3">
                  <span className="text-sm text-slate-300 w-20 capitalize">{t}</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 w-12 text-right">{count} ({Math.round(pct)}%)</span>
                </div>
              );
            })}
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-500">
              Yearly projection: <span className="text-white font-medium">{formatCurrency(totalAnnual)}</span> based on current active paid subscriptions.
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
