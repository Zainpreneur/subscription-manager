import { useEffect, useState } from 'react';
import { useCatalogueStore } from '../store/useCatalogueStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { useToastStore } from '../store/useToastStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Field';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { CATALOGUE_CATEGORIES } from '../services/mockCatalogue';
import { formatCurrency } from '../lib/utils';
import { Search, Filter, BookOpen, ExternalLink, Link2, Unlink } from 'lucide-react';
import type { CatalogueItem } from '../types/softwareCatalogue';

export function CataloguePage() {
  const store = useCatalogueStore();
  const subsStore = useSubscriptionStore();
  const toast = useToastStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [linking, setLinking] = useState<CatalogueItem | null>(null);
  const [selectedSub, setSelectedSub] = useState('');

  useEffect(() => { store.fetchAll(); subsStore.fetchAll(); }, []);

  const filtered = store.items.filter((i) => {
    const q = store.search.toLowerCase();
    if (q && !i.name.toLowerCase().includes(q) && !i.vendor.toLowerCase().includes(q)) return false;
    if (store.category !== 'all' && i.category !== store.category) return false;
    return true;
  });

  const handleLink = async () => {
    if (!linking) return;
    const plan = linking.plans.find((p) => p.id === linking.subscribedPlanId) || linking.plans[0];
    await store.linkPlan(linking.id, plan.id, selectedSub || undefined);
    setLinking(null);
    setSelectedSub('');
    toast.show(`Linked ${linking.name}`, 'success');
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><BookOpen className="text-indigo-400" /> Software Catalogue</h1>
        <p className="text-sm text-slate-400 mt-1">Browse software vendors and plans; link to your subscriptions.</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input value={store.search} onChange={(e) => store.setSearch(e.target.value)} placeholder="Search software or vendor..." className="pl-9" />
          </div>
          <Select value={store.category} onChange={(e) => store.setCategory(e.target.value)} className="md:w-48">
            <option value="all">All Categories</option>
            {CATALOGUE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Button variant="ghost" size="sm" icon={<Filter size={14} />} onClick={() => { store.setSearch(''); store.setCategory('all'); }}>Reset</Button>
        </div>
      </Card>

      {store.loading && store.items.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[0,1,2,3,4,5].map(i => <Skeleton key={i} className="h-48" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No software found" description="Try a different search or category." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const subscribedPlan = item.plans.find((p) => p.id === item.subscribedPlanId);
            const isExpanded = expanded === item.id;
            return (
              <Card key={item.id} className="p-5 flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">{item.logo}</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{item.name}</p>
                      <p className="text-xs text-slate-500 truncate">{item.vendor}</p>
                    </div>
                  </div>
                  <a href={item.website} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white"><ExternalLink size={14} /></a>
                </div>
                <p className="text-xs text-slate-400 mt-3 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((t) => <Badge key={t} className="bg-slate-700/50 text-slate-300 border-slate-600">{t}</Badge>)}
                </div>

                {subscribedPlan && (
                  <div className="mt-3 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                    <span>Subscribed: {subscribedPlan.name} ({formatCurrency(subscribedPlan.price)}/{subscribedPlan.billingCycle})</span>
                    <button onClick={() => { store.unlink(item.id); toast.show('Unlinked', 'info'); }} className="text-emerald-400 hover:text-emerald-200"><Unlink size={13} /></button>
                  </div>
                )}

                <button onClick={() => setExpanded(isExpanded ? null : item.id)} className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 text-left">
                  {isExpanded ? 'Hide plans' : `View ${item.plans.length} plans`}
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-2 border-t border-slate-800 pt-3">
                    {item.plans.map((plan) => (
                      <div key={plan.id} className={`rounded-lg border p-3 ${plan.recommended ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-800'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">{plan.name} {plan.recommended && <span className="text-[10px] text-indigo-400 ml-1">Recommended</span>}</p>
                            <p className="text-xs text-slate-500">{plan.limits || plan.type}</p>
                          </div>
                          <p className="text-sm font-bold text-white">{plan.price === 0 ? 'Free' : formatCurrency(plan.price)}<span className="text-xs text-slate-500 font-normal">/{plan.billingCycle}</span></p>
                        </div>
                        <ul className="mt-2 space-y-0.5">
                          {plan.features.map((f, i) => <li key={i} className="text-xs text-slate-400">• {f}</li>)}
                        </ul>
                        {!subscribedPlan && (
                          <Button size="sm" className="mt-2" onClick={() => { setLinking(item); }} icon={<Link2 size={12} />}>Link plan</Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={!!linking} onClose={() => setLinking(null)} title={`Link ${linking?.name}`} width="max-w-md">
        {linking && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">Select a subscription to link (optional).</p>
            <Select value={selectedSub} onChange={(e) => setSelectedSub(e.target.value)}>
              <option value="">— None (just mark subscribed) —</option>
              {subsStore.subscriptions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setLinking(null)}>Cancel</Button>
              <Button onClick={handleLink}>Link</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
