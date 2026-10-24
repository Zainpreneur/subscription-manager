import { useEffect, useState } from 'react';
import { useApiKeyStore } from '../store/useApiKeyStore';
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
import { API_KEY_SERVICES } from '../services/mockApiKeys';
import { KeyRound, Plus, Search, Filter, Copy, Eye, RefreshCw, Trash2, Pencil, AlertTriangle } from 'lucide-react';
import type { ApiKey, ApiKeyStatus, ApiKeyType, ApiKeyEnvironment } from '../types/apiKey';

const statusColor = (s: ApiKeyStatus) => {
  switch (s) {
    case 'active': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'revoked': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    case 'expired': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'rotating': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  }
};
const typeColor = (t: ApiKeyType) => {
  switch (t) {
    case 'paid': return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
    case 'free': return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
    case 'trial': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
  }
};
const envColor = (e: ApiKeyEnvironment) => {
  switch (e) {
    case 'production': return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    case 'staging': return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    case 'development': return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
  }
};

export function ApiKeysPage() {
  const store = useApiKeyStore();
  const subsStore = useSubscriptionStore();
  const toast = useToastStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ApiKey | null>(null);
  const [deleting, setDeleting] = useState<ApiKey | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [rotateId, setRotateId] = useState<string | null>(null);
  const [newKeyValue, setNewKeyValue] = useState('');

  useEffect(() => { store.fetchAll(); subsStore.fetchAll(); }, []);

  const { keys, filters } = store;
  const filtered = keys.filter((k) => {
    const q = filters.search.toLowerCase();
    if (q && !k.name.toLowerCase().includes(q) && !k.service.toLowerCase().includes(q)) return false;
    if (filters.service !== 'all' && k.service !== filters.service) return false;
    if (filters.status !== 'all' && k.status !== filters.status) return false;
    if (filters.environment !== 'all' && k.environment !== filters.environment) return false;
    if (filters.type !== 'all' && k.type !== filters.type) return false;
    return true;
  });

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (k: ApiKey) => { setEditing(k); setModalOpen(true); };

  const handleSubmit = async (values: any) => {
    if (editing) {
      await store.update(editing.id, values);
      toast.show('API key updated', 'success');
    } else {
      await store.add(values);
      toast.show('API key added', 'success');
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
    toast.show('API key deleted', 'info');
  };

  const handleRotate = async () => {
    if (!rotateId || !newKeyValue.trim()) return;
    await store.rotate(rotateId, newKeyValue.trim());
    setRotateId(null);
    setNewKeyValue('');
    toast.show('API key rotated', 'success');
  };

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); toast.show('Copied to clipboard', 'success'); }
    catch { toast.show('Copy failed', 'error'); }
  };

  const toggleReveal = (id: string) => setRevealed((r) => ({ ...r, [id]: !r[id] }));

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><KeyRound className="text-indigo-400" /> API Keys</h1>
          <p className="text-sm text-slate-400 mt-1">Track and manage API keys across your services.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openAdd}>Add API Key</Button>
      </div>

      {/* Security notice */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-200">Keys are stored locally for demo purposes. In production, store secrets in a vault and never expose full keys in the client.</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input value={filters.search} onChange={(e) => store.setFilter({ search: e.target.value })} placeholder="Search keys or services..." className="pl-9" />
          </div>
          <Select value={filters.service} onChange={(e) => store.setFilter({ service: e.target.value })} className="md:w-40">
            <option value="all">All Services</option>
            {API_KEY_SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select value={filters.status} onChange={(e) => store.setFilter({ status: e.target.value })} className="md:w-36">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
            <option value="expired">Expired</option>
            <option value="rotating">Rotating</option>
          </Select>
          <Select value={filters.environment} onChange={(e) => store.setFilter({ environment: e.target.value })} className="md:w-40">
            <option value="all">All Envs</option>
            <option value="production">Production</option>
            <option value="staging">Staging</option>
            <option value="development">Development</option>
          </Select>
          <Select value={filters.type} onChange={(e) => store.setFilter({ type: e.target.value })} className="md:w-32">
            <option value="all">All Types</option>
            <option value="paid">Paid</option>
            <option value="free">Free</option>
            <option value="trial">Trial</option>
          </Select>
          <Button variant="ghost" size="sm" icon={<Filter size={14} />} onClick={store.resetFilters}>Reset</Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3"><p className="text-xs text-slate-400">Total</p><p className="text-lg font-bold text-white">{keys.length}</p></Card>
        <Card className="p-3"><p className="text-xs text-slate-400">Active</p><p className="text-lg font-bold text-emerald-400">{keys.filter(k=>k.status==='active').length}</p></Card>
        <Card className="p-3"><p className="text-xs text-slate-400">Production</p><p className="text-lg font-bold text-rose-300">{keys.filter(k=>k.environment==='production').length}</p></Card>
        <Card className="p-3"><p className="text-xs text-slate-400">Expiring soon</p>
          {/* oxlint-disable-next-line react/purity */}
          <p className="text-lg font-bold text-amber-400">{keys.filter(k=>k.expiresAt && new Date(k.expiresAt) < new Date(Date.now()+30*86400000)).length}</p></Card>
      </div>

      {/* Table */}
      {store.loading && keys.length === 0 ? (
        <Card className="p-5">{[0,1,2,3].map(i => <Skeleton key={i} className="h-12 mb-3" />)}</Card>
      ) : filtered.length === 0 ? (
        <EmptyState title="No API keys found" description="Add an API key to start tracking." action={<Button icon={<Plus size={16} />} onClick={openAdd}>Add API Key</Button>} />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Service</th>
                  <th className="text-left px-4 py-3">Key</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Env</th>
                  <th className="text-left px-4 py-3">Scopes</th>
                  <th className="text-left px-4 py-3">Expires</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{k.name}</p>
                      <p className="text-xs text-slate-500">{k.environment} · {k.usageCount} uses</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{k.service}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-slate-300 font-mono">{revealed[k.id] ? k.key : k.masked}</code>
                        <button onClick={() => toggleReveal(k.id)} className="text-slate-500 hover:text-white"><Eye size={13} /></button>
                        <button onClick={() => copy(k.key)} className="text-slate-500 hover:text-white"><Copy size={13} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge className={typeColor(k.type)}>{k.type}</Badge></td>
                    <td className="px-4 py-3"><Badge className={statusColor(k.status)}>{k.status}</Badge></td>
                    <td className="px-4 py-3"><Badge className={envColor(k.environment)}>{k.environment}</Badge></td>
                    <td className="px-4 py-3 text-xs text-slate-400 max-w-[160px] truncate">{k.scopes.join(', ') || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{k.expiresAt ? k.expiresAt : '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button onClick={() => { setRotateId(k.id); setNewKeyValue(''); }} className="p-1.5 text-slate-400 hover:text-blue-400 rounded hover:bg-slate-800" title="Rotate"><RefreshCw size={14} /></button>
                        <button onClick={() => openEdit(k)} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"><Pencil size={14} /></button>
                        <button onClick={() => setDeleting(k)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit API Key' : 'Add API Key'} width="max-w-2xl">
        <ApiKeyForm initial={editing} onSubmit={handleSubmit} onCancel={() => { setModalOpen(false); setEditing(null); }} loading={store.loading} subscriptions={subsStore.subscriptions} />
      </Modal>

      {/* Rotate Modal */}
      <Modal open={!!rotateId} onClose={() => setRotateId(null)} title="Rotate API Key" width="max-w-md">
        <div className="space-y-3">
          <p className="text-sm text-slate-400">Enter the new key value. The old key will be replaced.</p>
          <Input value={newKeyValue} onChange={(e) => setNewKeyValue(e.target.value)} placeholder="sk-..." />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRotateId(null)}>Cancel</Button>
            <Button onClick={handleRotate} disabled={!newKeyValue.trim()}>Rotate</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} title="Delete API Key" message={`Delete ${deleting?.name}?`} loading={deleteLoading} />
    </div>
  );
}

function ApiKeyForm({ initial, onSubmit, onCancel, loading, subscriptions }: { initial: ApiKey | null; onSubmit: (v: any) => void; onCancel: () => void; loading: boolean; subscriptions: any[] }) {
  const [values, setValues] = useState({
    name: initial?.name || '',
    service: initial?.service || 'OpenAI',
    type: (initial?.type || 'paid') as ApiKeyType,
    status: (initial?.status || 'active') as ApiKeyStatus,
    environment: (initial?.environment || 'development') as ApiKeyEnvironment,
    key: initial?.key || '',
    scopes: initial?.scopes?.join(', ') || '',
    expiresAt: initial?.expiresAt || '',
    notes: initial?.notes || '',
    rateLimit: initial?.rateLimit || '',
    subscriptionId: initial?.subscriptionId || '',
  });
  const set = (p: any) => setValues((v) => ({ ...v, ...p }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: values.name,
      service: values.service,
      type: values.type,
      status: values.status,
      environment: values.environment,
      key: values.key,
      scopes: values.scopes.split(',').map((s) => s.trim()).filter(Boolean),
      expiresAt: values.expiresAt || undefined,
      notes: values.notes,
      rateLimit: values.rateLimit || undefined,
      subscriptionId: values.subscriptionId || undefined,
      usageCount: initial?.usageCount || 0,
      lastUsedAt: initial?.lastUsedAt,
    });
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-xs text-slate-400 mb-1 block">Name</label><Input value={values.name} onChange={(e) => set({ name: e.target.value })} required /></div>
        <div><label className="text-xs text-slate-400 mb-1 block">Service</label>
          <Select value={values.service} onChange={(e) => set({ service: e.target.value })}>
            {API_KEY_SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
        <div><label className="text-xs text-slate-400 mb-1 block">Type</label>
          <Select value={values.type} onChange={(e) => set({ type: e.target.value })}>
            <option value="paid">Paid</option><option value="free">Free</option><option value="trial">Trial</option>
          </Select>
        </div>
        <div><label className="text-xs text-slate-400 mb-1 block">Status</label>
          <Select value={values.status} onChange={(e) => set({ status: e.target.value })}>
            <option value="active">Active</option><option value="revoked">Revoked</option><option value="expired">Expired</option><option value="rotating">Rotating</option>
          </Select>
        </div>
        <div><label className="text-xs text-slate-400 mb-1 block">Environment</label>
          <Select value={values.environment} onChange={(e) => set({ environment: e.target.value })}>
            <option value="development">Development</option><option value="staging">Staging</option><option value="production">Production</option>
          </Select>
        </div>
        <div><label className="text-xs text-slate-400 mb-1 block">Expires At</label><Input type="date" value={values.expiresAt} onChange={(e) => set({ expiresAt: e.target.value })} /></div>
        <div><label className="text-xs text-slate-400 mb-1 block">Rate Limit</label><Input value={values.rateLimit} onChange={(e) => set({ rateLimit: e.target.value })} placeholder="1000 req/min" /></div>
        <div><label className="text-xs text-slate-400 mb-1 block">Linked Subscription</label>
          <Select value={values.subscriptionId} onChange={(e) => set({ subscriptionId: e.target.value })}>
            <option value="">— None —</option>
            {subscriptions.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </div>
      </div>
      <div><label className="text-xs text-slate-400 mb-1 block">API Key</label><Input value={values.key} onChange={(e) => set({ key: e.target.value })} required placeholder="sk-..." /></div>
      <div><label className="text-xs text-slate-400 mb-1 block">Scopes (comma separated)</label><Input value={values.scopes} onChange={(e) => set({ scopes: e.target.value })} placeholder="read, write" /></div>
      <div><label className="text-xs text-slate-400 mb-1 block">Notes</label><Textarea value={values.notes} onChange={(e) => set({ notes: e.target.value })} /></div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{initial ? 'Save' : 'Add Key'}</Button>
      </div>
    </form>
  );
}
