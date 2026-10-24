import { useEffect, useState } from 'react';
import { useCatalogueStore } from '../store/useCatalogueStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { useToastStore } from '../store/useToastStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Field';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Many2ManyField } from '../components/fields/Many2ManyField';
import { CATALOGUE_CATEGORIES } from '../services/mockCatalogue';
import { formatCurrency } from '../lib/utils';
import { Search, Filter, BookOpen, ExternalLink, Link2, Unlink, Plus, Pencil, Trash2 } from 'lucide-react';
import type { CatalogueItem } from '../types/softwareCatalogue';

export function CataloguePage() {
  const store = useCatalogueStore();
  const subsStore = useSubscriptionStore();
  const toast = useToastStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [linking, setLinking] = useState<CatalogueItem | null>(null);
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogueItem | null>(null);
  const [deleting, setDeleting] = useState<CatalogueItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    await store.linkPlan(linking.id, plan.id, selectedSubs);
    setLinking(null);
    setSelectedSubs([]);
    toast.show(`Linked ${linking.name}`, 'success');
  };

  const handleSubmit = async (values: any) => {
    if (editing) {
      await store.update(editing.id, values);
      toast.show('Software updated', 'success');
    } else {
      await store.create(values);
      toast.show('Software added', 'success');
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    await store.remove(deleting.id);
    setDeleteLoading(false);
    setDeleting(null);
    toast.show('Software deleted', 'info');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><BookOpen className="text-indigo-400" /> Software Catalogue</h1>
          <p className="text-sm text-slate-400 mt-1">Browse software vendors and plans; link to your subscriptions.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => { setEditing(null); setModalOpen(true); }}>Add Software</Button>
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
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditing(item); setModalOpen(true); }} className="text-slate-500 hover:text-white p-1"><Pencil size={13} /></button>
                    <button onClick={() => setDeleting(item)} className="text-slate-500 hover:text-rose-400 p-1"><Trash2 size={13} /></button>
                    <a href={item.website} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white p-1"><ExternalLink size={13} /></a>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((t) => <Badge key={t} className="bg-slate-700/50 text-slate-300 border-slate-600">{t}</Badge>)}
                </div>

                {subscribedPlan && (
                  <div className="mt-3 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                    <div className="flex items-center justify-between">
                      <span>Subscribed: {subscribedPlan.name} ({formatCurrency(subscribedPlan.price)}/{subscribedPlan.billingCycle})</span>
                      <button onClick={() => { store.unlink(item.id); toast.show('Unlinked', 'info'); }} className="text-emerald-400 hover:text-emerald-200"><Unlink size={13} /></button>
                    </div>
                    {item.linkedSubscriptionIds && item.linkedSubscriptionIds.length > 0 && (
                      <p className="mt-1 text-[11px] text-emerald-200/80">Linked to {item.linkedSubscriptionIds.length} subscription(s) (m2m)</p>
                    )}
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

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit Software' : 'Add Software'} width="max-w-2xl">
        <CatalogueForm initial={editing} onSubmit={handleSubmit} onCancel={() => { setModalOpen(false); setEditing(null); }} loading={store.loading} />
      </Modal>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Delete Software" message={`Delete ${deleting?.name}?`} loading={deleteLoading} />

      <Modal open={!!linking} onClose={() => setLinking(null)} title={`Link ${linking?.name}`} width="max-w-md">
        {linking && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">Select subscriptions to link (m2m).</p>
            <Many2ManyField label="Subscriptions" value={selectedSubs} onChange={setSelectedSubs} options={subsStore.subscriptions.map((s) => ({ id: s.id, label: s.name }))} />
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

function CatalogueForm({ initial, onSubmit, onCancel, loading }: { initial: CatalogueItem | null; onSubmit: (v: any) => void; onCancel: () => void; loading: boolean }) {
  const [values, setValues] = useState({
    name: initial?.name || '',
    vendor: initial?.vendor || '',
    category: initial?.category || 'AI Tools',
    description: initial?.description || '',
    website: initial?.website || '',
    logo: initial?.logo || '📦',
    tags: initial?.tags?.join(', ') || '',
  });
  const [plans, setPlans] = useState<CatalogueItem['plans']>(initial?.plans || [{ id: 'p1', name: 'Free', price: 0, billingCycle: 'free', type: 'free', features: [] }]);
  const set = (p: any) => setValues((v: any) => ({ ...v, ...p }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: values.name,
      vendor: values.vendor,
      category: values.category,
      description: values.description,
      website: values.website,
      logo: values.logo,
      tags: values.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      plans: plans.map((p, i) => ({ ...p, id: p.id || `p${i + 1}` })),
    });
  };

  const updatePlan = (idx: number, patch: any) => setPlans((ps) => ps.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  const removePlan = (idx: number) => setPlans((ps) => ps.filter((_, i) => i !== idx));
  const addPlan = () => setPlans((ps) => [...ps, { id: `p${ps.length + 1}`, name: 'New Plan', price: 0, billingCycle: 'monthly', type: 'paid', features: [] }]);

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-xs text-slate-400 mb-1 block">Name</label><Input value={values.name} onChange={(e) => set({ name: e.target.value })} required /></div>
        <div><label className="text-xs text-slate-400 mb-1 block">Vendor</label><Input value={values.vendor} onChange={(e) => set({ vendor: e.target.value })} required /></div>
        <div><label className="text-xs text-slate-400 mb-1 block">Category</label>
          <Select value={values.category} onChange={(e) => set({ category: e.target.value })}>
            {CATALOGUE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <div><label className="text-xs text-slate-400 mb-1 block">Logo (emoji)</label><Input value={values.logo} onChange={(e) => set({ logo: e.target.value })} /></div>
        <div><label className="text-xs text-slate-400 mb-1 block">Website</label><Input value={values.website} onChange={(e) => set({ website: e.target.value })} /></div>
        <div><label className="text-xs text-slate-400 mb-1 block">Tags (comma)</label><Input value={values.tags} onChange={(e) => set({ tags: e.target.value })} /></div>
      </div>
      <div><label className="text-xs text-slate-400 mb-1 block">Description</label><Textarea value={values.description} onChange={(e) => set({ description: e.target.value })} /></div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-slate-400">Plans</label>
          <Button type="button" variant="ghost" size="sm" onClick={addPlan}>+ Add plan</Button>
        </div>
        <div className="space-y-3">
          {plans.map((plan, idx) => (
            <div key={idx} className="rounded-lg border border-slate-800 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Input value={plan.name} onChange={(e) => updatePlan(idx, { name: e.target.value })} placeholder="Plan name" />
                <button type="button" onClick={() => removePlan(idx)} className="ml-2 text-slate-400 hover:text-rose-400"><Trash2 size={14} /></button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input type="number" step="0.01" value={plan.price} onChange={(e) => updatePlan(idx, { price: parseFloat(e.target.value) || 0 })} placeholder="Price" />
                <Select value={plan.billingCycle} onChange={(e) => updatePlan(idx, { billingCycle: e.target.value })}>
                  <option value="free">Free</option><option value="monthly">Monthly</option><option value="annual">Annual</option><option value="one-time">One-time</option>
                </Select>
                <Select value={plan.type} onChange={(e) => updatePlan(idx, { type: e.target.value })}>
                  <option value="free">Free</option><option value="paid">Paid</option><option value="trial">Trial</option>
                </Select>
              </div>
              <Input value={plan.features.join(', ')} onChange={(e) => updatePlan(idx, { features: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} placeholder="Features (comma separated)" />
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input type="checkbox" checked={!!plan.recommended} onChange={(e) => updatePlan(idx, { recommended: e.target.checked })} className="accent-indigo-500" />
                Recommended
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{initial ? 'Save' : 'Add Software'}</Button>
      </div>
    </form>
  );
}
