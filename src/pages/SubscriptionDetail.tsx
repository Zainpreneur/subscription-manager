import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { useToastStore } from '../store/useToastStore';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Field';
import { Modal } from '../components/ui/Modal';
import { SubscriptionForm } from '../components/SubscriptionForm';
import { formatCurrency, monthlyCost, annualCost, daysUntil, formatDate, statusColor, typeColor } from '../lib/utils';
import { ArrowLeft, Pencil, Trash2, Calendar, CreditCard, FileText, TrendingUp, Bell } from 'lucide-react';
import type { Subscription } from '../types/subscription';

export function SubscriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = useSubscriptionStore();
  const toast = useToastStore();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const s = await (await import('../services/subscriptionService')).subscriptionService.get(id);
      setSub(s);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return (
    <div className="space-y-5">
      <Skeleton className="h-6 w-24" />
      <div className="flex gap-4 items-center"><Skeleton className="h-14 w-14 rounded-xl" /><div className="space-y-2"><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-32" /></div></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[0,1,2,3].map(i => <Card key={i} className="p-4"><Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-6 w-24" /></Card>)}</div>
    </div>
  );
  if (!sub) return (
    <div className="text-center py-20">
      <p className="text-slate-400">Subscription not found.</p>
      <Button className="mt-4" onClick={() => navigate('/subscriptions')}>Back</Button>
    </div>
  );

  const handleToggleAutoRenew = async () => {
    const updated = await store.update(sub.id, { autoRenew: !sub.autoRenew });
    setSub(updated);
    toast.show(`Auto-renew ${updated.autoRenew ? 'enabled' : 'disabled'}`, 'info');
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    await store.remove(sub.id);
    setDeleteLoading(false);
    toast.show('Subscription deleted', 'info');
    navigate('/subscriptions');
  };

  const handleEdit = async (values: any) => {
    const updated = await store.update(sub.id, values);
    setSub(updated);
    setEditOpen(false);
    toast.show('Subscription updated', 'success');
  };

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-slate-800 flex items-center justify-center text-3xl">{sub.logo || '📦'}</div>
          <div>
            <h1 className="text-2xl font-bold text-white">{sub.name}</h1>
            <p className="text-sm text-slate-400">{sub.vendor} · {sub.category}</p>
            <div className="flex gap-2 mt-2">
              <Badge className={statusColor(sub.status)}>{sub.status}</Badge>
              <Badge className={typeColor(sub.type)}>{sub.type}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Pencil size={16} />} onClick={() => setEditOpen(true)}>Edit</Button>
          <Button variant="danger" icon={<Trash2 size={16} />} onClick={() => setDeleteOpen(true)}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-slate-400">Cost</p>
          <p className="text-xl font-bold text-white mt-1">{formatCurrency(sub.cost)}<span className="text-xs text-slate-500 font-normal">/{sub.billingCycle}</span></p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Monthly Equivalent</p>
          <p className="text-xl font-bold text-white mt-1">{formatCurrency(monthlyCost(sub))}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Yearly Projection</p>
          <p className="text-xl font-bold text-white mt-1">{formatCurrency(annualCost(sub))}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Days to Renewal</p>
          <p className="text-xl font-bold text-white mt-1">{daysUntil(sub.renewalDate) >= 0 ? daysUntil(sub.renewalDate) : 'Overdue'}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><h2 className="font-semibold text-white flex items-center gap-2"><Calendar size={16} className="text-indigo-400" /> Renewal Schedule</h2></CardHeader>
          <CardBody className="space-y-3">
            <Row label="Start Date" value={formatDate(sub.startDate)} />
            <Row label="Renewal Date" value={formatDate(sub.renewalDate)} />
            <Row label="Cancellation Reminder" value={sub.cancellationReminderDate ? formatDate(sub.cancellationReminderDate) : '—'} />
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-sm text-slate-400">Auto-renew</span>
              <button
                onClick={handleToggleAutoRenew}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${sub.autoRenew ? 'bg-indigo-600' : 'bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${sub.autoRenew ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold text-white flex items-center gap-2"><CreditCard size={16} className="text-indigo-400" /> Payment Method</h2></CardHeader>
          <CardBody className="space-y-3">
            <Row label="Method" value={sub.paymentMethod} />
            <Row label="Currency" value={sub.currency} />
            <Row label="Notes" value={sub.notes || '—'} />
            <Row label="Tags" value={sub.tags.length ? sub.tags.join(', ') : '—'} />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><h2 className="font-semibold text-white flex items-center gap-2"><TrendingUp size={16} className="text-indigo-400" /> Cost History</h2></CardHeader>
          <CardBody>
            {sub.costHistory.length === 0 ? (
              <p className="text-sm text-slate-500">No cost history recorded.</p>
            ) : (
              <div className="space-y-2">
                {sub.costHistory.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                    <div>
                      <p className="text-sm text-white">{formatDate(c.date)}</p>
                      {c.note && <p className="text-xs text-slate-500">{c.note}</p>}
                    </div>
                    <span className="text-sm font-medium text-white">{formatCurrency(c.amount, sub.currency)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold text-white flex items-center gap-2"><FileText size={16} className="text-indigo-400" /> Invoices</h2></CardHeader>
          <CardBody>
            {sub.invoices.length === 0 ? (
              <p className="text-sm text-slate-500">No invoices recorded.</p>
            ) : (
              <div className="space-y-2">
                {sub.invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                    <div>
                      <p className="text-sm text-white">{formatDate(inv.date)}</p>
                      <p className="text-xs text-slate-500">{inv.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={inv.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : inv.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'}>{inv.status}</Badge>
                      <span className="text-sm font-medium text-white">{formatCurrency(inv.amount, sub.currency)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader><h2 className="font-semibold text-white flex items-center gap-2"><Bell size={16} className="text-indigo-400" /> Cancellation Reminder</h2></CardHeader>
        <CardBody>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Input
              type="date"
              value={sub.cancellationReminderDate || ''}
              onChange={async (e) => {
                const updated = await store.update(sub.id, { cancellationReminderDate: e.target.value });
                setSub(updated);
              }}
            />
            <p className="text-xs text-slate-500">Set a date to be reminded before cancelling.</p>
          </div>
        </CardBody>
      </Card>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Subscription" width="max-w-2xl">
        <SubscriptionForm initial={sub} onSubmit={handleEdit} onCancel={() => setEditOpen(false)} loading={store.loading} />
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Subscription" width="max-w-md">
        <p className="text-sm text-slate-300 mb-5">Delete {sub.name}? This cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={deleteLoading}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm text-white text-right">{value}</span>
    </div>
  );
}
