import { useState, useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Field';
import { formatCurrency } from '../lib/utils';

export function SettingsPage() {
  const { settings, update } = useSettingsStore();
  const store = useSubscriptionStore();
  const [resetConfirm, setResetConfirm] = useState(false);
  useEffect(() => { store.fetchAll(); }, []);

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
    </div>
  );
}
