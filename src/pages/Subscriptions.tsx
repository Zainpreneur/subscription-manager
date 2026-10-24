import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { useCatalogueStore } from '../store/useCatalogueStore';
import { useToastStore } from '../store/useToastStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Field';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { SubscriptionForm } from '../components/SubscriptionForm';
import { CardView, ListView, TableView, GalleryView, KanbanView, TimelineView } from '../components/views/SubscriptionViews';

import { Plus, Search, Filter, LayoutGrid, List, Table2, GalleryHorizontal, Kanban, Clock } from 'lucide-react';
import type { Subscription } from '../types/subscription';

const CATEGORIES = ['all', 'AI Tools', 'Cloud Infrastructure', 'Productivity', 'Design', 'Development', 'Entertainment', 'Marketing', 'Security', 'Other'];

export function Subscriptions() {
  const store = useSubscriptionStore();
  const catalogueStore = useCatalogueStore();
  const toast = useToastStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [deleting, setDeleting] = useState<Subscription | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { store.fetchAll(); catalogueStore.fetchAll(); }, []);
  useEffect(() => {
    if (searchParams.get('add') === '1') {
      setEditing(null);
      setModalOpen(true);
      searchParams.delete('add');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  const { subscriptions, filters, view } = store;

  const filtered = subscriptions.filter((s) => {
    const q = filters.search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q) && !s.vendor.toLowerCase().includes(q)) return false;
    if (filters.category !== 'all' && s.category !== filters.category) return false;
    if (filters.type !== 'all' && s.type !== filters.type) return false;
    if (filters.status !== 'all' && s.status !== filters.status) return false;
    return true;
  });

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (s: Subscription) => { setEditing(s); setModalOpen(true); };

  const handleSubmit = async (values: any) => {
    const { catalogueItemId, planId, ...clean } = values;
    if (editing) {
      await store.update(editing.id, clean);
      toast.show('Subscription updated', 'success');
    } else {
      const created = await store.add(clean);
      if (catalogueItemId && planId) {
        await catalogueStore.linkPlan(catalogueItemId, planId, [created.id]);
      }
      toast.show('Subscription added', 'success');
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
    toast.show('Subscription deleted', 'info');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
          <p className="text-sm text-slate-400 mt-1">{filtered.length} of {subscriptions.length} services</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-lg border border-slate-700 overflow-x-auto">
            {[
              { key: 'card', label: 'Cards', icon: LayoutGrid },
              { key: 'list', label: 'List', icon: List },
              { key: 'table', label: 'Table', icon: Table2 },
              { key: 'gallery', label: 'Gallery', icon: GalleryHorizontal },
              { key: 'kanban', label: 'Kanban', icon: Kanban },
              { key: 'timeline', label: 'Timeline', icon: Clock },
            ].map((v) => (
              <button
                key={v.key}
                onClick={() => store.setView(v.key as any)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap transition ${view === v.key ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <v.icon size={14} /> {v.label}
              </button>
            ))}
          </div>
          <Button icon={<Plus size={16} />} onClick={openAdd}>Add Subscription</Button>
        </div>
      </div>

      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              value={filters.search}
              onChange={(e) => store.setFilter({ search: e.target.value })}
              placeholder="Search by name or vendor..."
              className="pl-9"
            />
          </div>
          <Select value={filters.category} onChange={(e) => store.setFilter({ category: e.target.value })} className="md:w-48">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
          </Select>
          <Select value={filters.type} onChange={(e) => store.setFilter({ type: e.target.value })} className="md:w-40">
            <option value="all">All Types</option>
            <option value="paid">Paid</option>
            <option value="free">Free</option>
            <option value="lifetime">Lifetime</option>
            <option value="trial">Trial</option>
          </Select>
          <Select value={filters.status} onChange={(e) => store.setFilter({ status: e.target.value })} className="md:w-40">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Button variant="ghost" size="sm" icon={<Filter size={14} />} onClick={store.resetFilters}>Reset</Button>
        </div>
      </Card>

      {/* Views */}
      {view === 'card' && <CardView items={filtered} onEdit={openEdit} onDelete={setDeleting} />}
      {view === 'list' && <ListView items={filtered} onEdit={openEdit} onDelete={setDeleting} />}
      {view === 'table' && <TableView items={filtered} onEdit={openEdit} onDelete={setDeleting} />}
      {view === 'gallery' && <GalleryView items={filtered} onEdit={openEdit} onDelete={setDeleting} />}
      {view === 'kanban' && <KanbanView items={filtered} onEdit={openEdit} onDelete={setDeleting} />}
      {view === 'timeline' && <TimelineView items={filtered} onEdit={openEdit} onDelete={setDeleting} />}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit Subscription' : 'Add Subscription'} width="max-w-2xl">
        <SubscriptionForm
          initial={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditing(null); }}
          loading={store.loading}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Subscription"
        message={`Delete ${deleting?.name}? This cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  );
}
