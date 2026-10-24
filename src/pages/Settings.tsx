import { useState, useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { usePaymentStore } from '../store/usePaymentStore';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Field';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { formatCurrency } from '../lib/utils';
import { Plus as PlusIcon, Pencil as PencilIcon, Trash2 as TrashIcon } from 'lucide-react';
import type { PaymentMethod } from '../types/payment';

export function SettingsPage() {
  const { settings, update } = useSettingsStore();
  const store = useSubscriptionStore();
  const payStore = usePaymentStore();
  const [resetConfirm, setResetConfirm] = useState(false);
  const handlePaySubmit = async (values: any) => {
    if (editingPay) { await payStore.update(editingPay.id, values); }
    else { await payStore.add(values); }
    setPayModal(false); setEditingPay(null);
  };
  const handlePayDelete = async () => {
    if (!deletingPay) return;
    await payStore.remove(deletingPay.id);
    setDeletingPay(null);
  };
  const [payModal, setPayModal] = useState(false);
  const [editingPay, setEditingPay] = useState<PaymentMethod | null>(null);
  const [deletingPay, setDeletingPay] = useState<PaymentMethod | null>(null);
  useEffect(() => { store.fetchAll(); payStore.fetchAll(); }, []);

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your preferences.</p>
      </div>

      <Card>
        <CardHeader><h2 className="font-semibold text-white">Preferences</h2></CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Currency</label>
            <Select value={settings.currency} onChange={(e) => update({ currency: e.target.value })} className="max-w-xs">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Renewal reminder (days before)</label>
            <Input type="number" min="1" max="30" value={settings.reminderDays} onChange={(e) => update({ reminderDays: parseInt(e.target.value) || 7 })} className="max-w-xs" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="notif" checked={settings.notifications} onChange={(e) => update({ notifications: e.target.checked })} className="accent-indigo-500" />
            <label htmlFor="notif" className="text-sm text-slate-300">Enable notifications</label>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Payment Methods</h2>
          <Button size="sm" icon={<PlusIcon />} onClick={() => { setEditingPay(null); setPayModal(true); }}>Add</Button>
        </CardHeader>
        <CardBody className="space-y-2">
          {payStore.methods.length === 0 && <p className="text-sm text-slate-500">No payment methods.</p>}
          {payStore.methods.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
              <div>
                <p className="text-sm text-white">{m.label} {m.isDefault && <span className="text-[10px] text-indigo-400 ml-1">(default)</span>}</p>
                <p className="text-xs text-slate-500">{m.type} {m.last4 ? `•••• ${m.last4}` : ''} {m.expiry ? `exp ${m.expiry}` : ''}</p>
              </div>
              <div className="flex gap-1">
                {!m.isDefault && <Button variant="ghost" size="sm" onClick={() => payStore.setDefault(m.id)}>Set default</Button>}
                <button onClick={() => { setEditingPay(m); setPayModal(true); }} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"><PencilIcon size={14} /></button>
                <button onClick={() => setDeletingPay(m)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"><TrashIcon size={14} /></button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader><h2 className="font-semibold text-white">Data</h2></CardHeader>
        <CardBody className="space-y-3">
          <p className="text-sm text-slate-400">Reset all subscription data back to the original mock dataset. This cannot be undone.</p>
          <Button variant="danger" onClick={() => setResetConfirm(true)}>Reset Data</Button>
          {resetConfirm && (
            <div className="mt-3 p-3 rounded-lg border border-rose-500/30 bg-rose-500/10">
              <p className="text-sm text-rose-300 mb-3">Are you sure? All changes will be lost.</p>
              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={async () => { await store.resetData(); setResetConfirm(false); }}>Confirm Reset</Button>
                <Button variant="ghost" size="sm" onClick={() => setResetConfirm(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader><h2 className="font-semibold text-white">About</h2></CardHeader>
        <CardBody>
          <p className="text-sm text-slate-400">SubManager — Software Subscription Management. Mock data layer ready for REST/GraphQL/database integration.</p>
          <p className="text-xs text-slate-500 mt-2">Total active spend: {formatCurrency(store.subscriptions.filter(s => s.status === 'active' && s.type === 'paid').reduce((a, s) => a + (s.cost), 0))}</p>
        </CardBody>
      </Card>

      <Modal open={payModal} onClose={() => { setPayModal(false); setEditingPay(null); }} title={editingPay ? 'Edit Payment Method' : 'Add Payment Method'} width="max-w-md">
        <PaymentMethodForm initial={editingPay} onSubmit={handlePaySubmit} onCancel={() => { setPayModal(false); setEditingPay(null); }} />
      </Modal>
      <ConfirmDialog open={!!deletingPay} onClose={() => setDeletingPay(null)} onConfirm={handlePayDelete} title="Delete Payment Method" message={`Delete ${deletingPay?.label}?`} />
    </div>
  );
}

function PaymentMethodForm({ initial, onSubmit, onCancel }: { initial: PaymentMethod | null; onSubmit: (v: any) => void; onCancel: () => void }) {
  const [values, setValues] = useState({
    label: initial?.label || '',
    type: (initial?.type || 'card') as PaymentMethod['type'],
    last4: initial?.last4 || '',
    expiry: initial?.expiry || '',
    holder: initial?.holder || '',
    isDefault: initial?.isDefault || false,
  });
  const set = (p: any) => setValues((v) => ({ ...v, ...p }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div><label className="text-xs text-slate-400 mb-1 block">Label</label><Input value={values.label} onChange={(e) => set({ label: e.target.value })} required placeholder="Visa •••• 4242" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs text-slate-400 mb-1 block">Type</label>
          <Select value={values.type} onChange={(e) => set({ type: e.target.value })}>
            <option value="card">Card</option><option value="paypal">PayPal</option><option value="bank">Bank</option><option value="other">Other</option>
          </Select>
        </div>
        <div><label className="text-xs text-slate-400 mb-1 block">Last 4</label><Input value={values.last4} onChange={(e) => set({ last4: e.target.value })} placeholder="4242" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs text-slate-400 mb-1 block">Expiry (MM/YY)</label><Input value={values.expiry} onChange={(e) => set({ expiry: e.target.value })} placeholder="12/28" /></div>
        <div><label className="text-xs text-slate-400 mb-1 block">Holder</label><Input value={values.holder} onChange={(e) => set({ holder: e.target.value })} /></div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="def" checked={values.isDefault} onChange={(e) => set({ isDefault: e.target.checked })} className="accent-indigo-500" />
        <label htmlFor="def" className="text-sm text-slate-300">Set as default</label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initial ? 'Save' : 'Add'}</Button>
      </div>
    </form>
  );
}
