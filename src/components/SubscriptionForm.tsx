import { useEffect, useState } from 'react';
import { CATEGORIES } from '../services/mockData';
import { Input, Select, Textarea } from './ui/Field';
import { Button } from './ui/Button';
import type { Subscription, SubscriptionType, SubscriptionStatus, BillingCycle } from '../types/subscription';
import { useCatalogueStore } from '../store/useCatalogueStore';
import { usePaymentStore } from '../store/usePaymentStore';
import { Many2OneField } from '../components/fields/Many2OneField';

type FormValues = Omit<Subscription, 'id' | 'createdAt' | 'updatedAt' | 'costHistory' | 'invoices'>;

const empty: FormValues = {
  name: '',
  vendor: '',
  category: 'Other',
  type: 'paid',
  status: 'active',
  cost: 0,
  currency: 'USD',
  billingCycle: 'monthly',
  startDate: new Date().toISOString().slice(0, 10),
  renewalDate: new Date().toISOString().slice(0, 10),
  autoRenew: true,
  cancellationReminderDate: '',
  paymentMethod: 'Visa •••• 4242',
  notes: '',
  tags: [],
  logo: '',
};

interface Props {
  initial?: Subscription;
  onSubmit: (values: FormValues & { catalogueItemId?: string; planId?: string }) => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function SubscriptionForm({ initial, onSubmit, onCancel, loading }: Props) {
  const [values, setValues] = useState<FormValues>(empty);
  const [tagsInput, setTagsInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const catalogue = useCatalogueStore();
  const payStore = usePaymentStore();
  const [catalogueItemId, setCatalogueItemId] = useState<string>('');
  const [planId, setPlanId] = useState<string>('');
  useEffect(() => { catalogue.fetchAll(); payStore.fetchAll(); }, []);

  useEffect(() => {
    if (initial) {
      setValues({
        name: initial.name,
        vendor: initial.vendor,
        category: initial.category,
        type: initial.type,
        status: initial.status,
        cost: initial.cost,
        currency: initial.currency,
        billingCycle: initial.billingCycle,
        startDate: initial.startDate,
        renewalDate: initial.renewalDate,
        autoRenew: initial.autoRenew,
        cancellationReminderDate: initial.cancellationReminderDate || '',
        paymentMethod: initial.paymentMethod,
        paymentMethodId: initial.paymentMethodId,
        notes: initial.notes,
        tags: initial.tags,
        logo: initial.logo || '',
      });
      setTagsInput(initial.tags.join(', '));
    }
  }, [initial]);

  const set = (patch: Partial<FormValues>) => setValues((v) => ({ ...v, ...patch }));

  const selectedCatalogue = catalogue.items.find((c) => c.id === catalogueItemId);
  const selectedPlan = selectedCatalogue?.plans.find((p) => p.id === planId);

  useEffect(() => {
    if (!selectedCatalogue || !selectedPlan) return;
    setValues((v) => ({
      ...v,
      name: selectedCatalogue.name + (selectedPlan.name !== 'Free' ? ` - ${selectedPlan.name}` : ''),
      vendor: selectedCatalogue.vendor,
      category: selectedCatalogue.category,
      type: selectedPlan.type === 'free' ? 'free' : selectedPlan.type === 'trial' ? 'trial' : 'paid',
      cost: selectedPlan.price,
      billingCycle: (selectedPlan.billingCycle === 'free' ? 'monthly' : selectedPlan.billingCycle) as BillingCycle,
      notes: selectedCatalogue.description,
      logo: selectedCatalogue.logo,
    }));
    setTagsInput(selectedCatalogue.tags.join(', '));
  }, [catalogueItemId, planId]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = 'Name is required';
    if (!values.vendor.trim()) e.vendor = 'Vendor is required';
    if (values.cost < 0) e.cost = 'Cost cannot be negative';
    if (!values.startDate) e.startDate = 'Start date is required';
    if (!values.renewalDate) e.renewalDate = 'Renewal date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    onSubmit({ ...values, tags, catalogueItemId: catalogueItemId || undefined, planId: planId || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Prefill from catalogue (optional)</label>
          <Select value={catalogueItemId} onChange={(e) => { setCatalogueItemId(e.target.value); setPlanId(''); }}>
            <option value="">— Manual entry —</option>
            {catalogue.items.map((c) => <option key={c.id} value={c.id}>{c.logo} {c.name}</option>)}
          </Select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Plan</label>
          <Select value={planId} onChange={(e) => setPlanId(e.target.value)} disabled={!selectedCatalogue}>
            <option value="">— Select plan —</option>
            {selectedCatalogue?.plans.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.price === 0 ? 'Free' : `$${p.price}/${p.billingCycle}`}</option>)}
          </Select>
        </div>
      </div>
      {selectedPlan && <p className="text-[11px] text-slate-500 -mt-2">Fields below auto-populated from the selected plan; edit freely.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Name</label>
          <Input value={values.name} onChange={(e) => { set({ name: e.target.value }); if (touched.name) validate(); }} onBlur={() => { setTouched((t) => ({ ...t, name: true })); validate(); }} className={errors.name ? 'border-rose-500 focus:ring-rose-500/50' : ''} required placeholder="e.g. ChatGPT Plus" />
          {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Vendor</label>
          <Input value={values.vendor} onChange={(e) => { set({ vendor: e.target.value }); if (touched.vendor) validate(); }} onBlur={() => { setTouched((t) => ({ ...t, vendor: true })); validate(); }} className={errors.vendor ? 'border-rose-500 focus:ring-rose-500/50' : ''} required placeholder="OpenAI" />
          {errors.vendor && <p className="text-xs text-rose-400 mt-1">{errors.vendor}</p>}
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Category</label>
          <Select value={values.category} onChange={(e) => set({ category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Type</label>
          <Select value={values.type} onChange={(e) => set({ type: e.target.value as SubscriptionType })}>
            <option value="paid">Paid</option>
            <option value="free">Free</option>
            <option value="lifetime">Lifetime</option>
            <option value="trial">Trial</option>
          </Select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Status</label>
          <Select value={values.status} onChange={(e) => set({ status: e.target.value as SubscriptionStatus })}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Billing Cycle</label>
          <Select value={values.billingCycle} onChange={(e) => set({ billingCycle: e.target.value as BillingCycle })}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
            <option value="one-time">One-time</option>
          </Select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Cost</label>
          <Input type="number" step="0.01" min="0" value={values.cost} onChange={(e) => set({ cost: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Currency</label>
          <Input value={values.currency} onChange={(e) => set({ currency: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Start Date</label>
          <Input type="date" value={values.startDate} onChange={(e) => set({ startDate: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Renewal Date</label>
          <Input type="date" value={values.renewalDate} onChange={(e) => set({ renewalDate: e.target.value })} />
        </div>
        <Many2OneField
          label="Payment Method (m2o)"
          value={values.paymentMethodId || ''}
          onChange={(id) => {
            const m = payStore.methods.find((x) => x.id === id);
            set({ paymentMethodId: id || undefined, paymentMethod: m ? m.label : values.paymentMethod });
          }}
          options={payStore.methods.map((m) => ({ id: m.id, label: m.label, subtitle: m.last4 ? `•••• ${m.last4}` : undefined }))}
          placeholder="— Select payment method —"
          help="Linked to Settings → Payment Methods"
        />
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Cancellation Reminder</label>
          <Input type="date" value={values.cancellationReminderDate || ''} onChange={(e) => set({ cancellationReminderDate: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-400 mb-1 block">Logo (emoji)</label>
        <Input value={values.logo || ''} onChange={(e) => set({ logo: e.target.value })} placeholder="📦" />
      </div>
      <div>
        <label className="text-xs text-slate-400 mb-1 block">Tags (comma separated)</label>
        <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="ai, productivity" />
      </div>
      <div>
        <label className="text-xs text-slate-400 mb-1 block">Notes</label>
        <Textarea value={values.notes} onChange={(e) => set({ notes: e.target.value })} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="autorenew" checked={values.autoRenew} onChange={(e) => set({ autoRenew: e.target.checked })} className="accent-indigo-500" />
        <label htmlFor="autorenew" className="text-sm text-slate-300">Auto-renew</label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{initial ? 'Save Changes' : 'Add Subscription'}</Button>
      </div>
    </form>
  );
}
