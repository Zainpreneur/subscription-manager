import { useEffect, useState } from 'react';
import { useBudgetStore } from '../store/useBudgetStore';
import { useToastStore } from '../store/useToastStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Field';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency } from '../lib/utils';
import { Plus, Trash2, Pencil, Wallet } from 'lucide-react';
import type { Budget, BudgetScope, BudgetPeriod } from '../types/budget';

export function BudgetsPage() {
  const store = useBudgetStore();
  const toast = useToastStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [deleting, setDeleting] = useState<Budget | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { store.fetchAll(); }, []);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (b: Budget) => { setEditing(b); setModalOpen(true); };

  const handleSubmit = async (values: any) => {
    if (editing) { await store.update(editing.id, values); toast.show('Budget updated', 'success'); }
    else { await store.add(values); toast.show('Budget created', 'success'); }
    setModalOpen(false); setEditing(null);
  };
  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    await store.remove(deleting.id);
    setDeleteLoading(false);
    setDeleting(null);
    toast.show('Budget deleted', 'info');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Wallet className="text-indigo-400" /> Budgets</h1>
          <p className="text-sm text-slate-400 mt-1">Set monthly spend caps and get alerted.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openAdd}>Add Budget</Button>
      </div>

      {store.loading && store.budgets.length === 0 ? (
        <Card className="p-5">{[0,1,2].map(i => <Skeleton key={i} className="h-20 mb-3" />)}</Card>
      ) : store.budgets.length === 0 ? (
        <EmptyState title="No budgets yet" description="Create a budget to track spend against caps." action={<Button icon={<Plus size={16} />} onClick={openAdd}>Add Budget</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {store.budgets.map((b) => {
            const spend = store.spendFor(b);
            const pct = Math.min(100, (spend / b.limit) * 100);
            const over = spend > b.limit;
            const near = !over && pct >= b.alertThreshold;
            return (
              <Card key={b.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">{b.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{b.scope === 'global' ? 'All spending' : `${b.scope}: ${b.target}`} · {b.period}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(b)} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"><Pencil size={14} /></button>
                    <button onClick={() => setDeleting(b)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-slate-300">{formatCurrency(spend)}</span>
                    <span className="text-slate-500">of {formatCurrency(b.limit)}</span>
                  </div>
                  <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${over ? 'bg-rose-500' : near ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className={over ? 'text-rose-400' : near ? 'text-amber-400' : 'text-emerald-400'}>{Math.round(pct)}% used</span>
                    <span className="text-slate-500">Alert at {b.alertThreshold}%</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit Budget' : 'Add Budget'} width="max-w-lg">
        <BudgetForm initial={editing} onSubmit={handleSubmit} onCancel={() => { setModalOpen(false); setEditing(null); }} loading={store.loading} />
      </Modal>
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Delete Budget" message={`Delete ${deleting?.name}?`} loading={deleteLoading} />
    </div>
  );
}

function BudgetForm({ initial, onSubmit, onCancel, loading }: { initial: Budget | null; onSubmit: (v: any) => void; onCancel: () => void; loading: boolean }) {
  const [values, setValues] = useState({
    name: initial?.name || '',
    scope: (initial?.scope || 'global') as BudgetScope,
    target: initial?.target || 'all',
    limit: initial?.limit || 100,
    period: (initial?.period || 'monthly') as BudgetPeriod,
    alertThreshold: initial?.alertThreshold || 80,
  });
  const set = (p: any) => setValues((v) => ({ ...v, ...p }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div><label className="text-xs text-slate-400 mb-1 block">Name</label><Input value={values.name} onChange={(e) => set({ name: e.target.value })} required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs text-slate-400 mb-1 block">Scope</label>
          <Select value={values.scope} onChange={(e) => set({ scope: e.target.value })}>
            <option value="global">Global</option><option value="category">Category</option><option value="service">Service/Vendor</option>
          </Select>
        </div>
        <div><label className="text-xs text-slate-400 mb-1 block">Target</label><Input value={values.target} onChange={(e) => set({ target: e.target.value })} placeholder="all / category / vendor" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs text-slate-400 mb-1 block">Limit</label><Input type="number" step="0.01" value={values.limit} onChange={(e) => set({ limit: parseFloat(e.target.value) || 0 })} /></div>
        <div><label className="text-xs text-slate-400 mb-1 block">Period</label>
          <Select value={values.period} onChange={(e) => set({ period: e.target.value })}>
            <option value="monthly">Monthly</option><option value="annual">Annual</option>
          </Select>
        </div>
      </div>
      <div><label className="text-xs text-slate-400 mb-1 block">Alert threshold (%)</label><Input type="number" min="1" max="100" value={values.alertThreshold} onChange={(e) => set({ alertThreshold: parseInt(e.target.value) || 80 })} /></div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{initial ? 'Save' : 'Create'}</Button>
      </div>
    </form>
  );
}
