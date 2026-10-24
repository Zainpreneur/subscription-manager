import { useNavigate } from 'react-router-dom';
import { formatCurrency, daysUntil, statusColor, typeColor } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Pencil, Trash2 } from 'lucide-react';
import type { Subscription } from '../../types/subscription';

interface ViewProps {
  items: Subscription[];
  onEdit: (s: Subscription) => void;
  onDelete: (s: Subscription) => void;
}

export function CardView({ items, onEdit, onDelete }: ViewProps) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((s) => (
        <Card key={s.id} className="p-5 hover:border-slate-700 transition group cursor-pointer" onClick={() => navigate(`/subscriptions/${s.id}`)}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl">{s.logo || '📦'}</div>
              <div className="min-w-0">
                <p className="font-semibold text-white truncate">{s.name}</p>
                <p className="text-xs text-slate-500 truncate">{s.vendor}</p>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => onEdit(s)} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"><Pencil size={14} /></button>
              <button onClick={() => onDelete(s)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-white">{formatCurrency(s.cost)}<span className="text-xs text-slate-500 font-normal">/{s.billingCycle}</span></p>
              <p className="text-xs text-slate-500">{s.category}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge className={statusColor(s.status)}>{s.status}</Badge>
              <Badge className={typeColor(s.type)}>{s.type}</Badge>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Renews {s.renewalDate}</span>
            <span>{daysUntil(s.renewalDate) >= 0 ? `in ${daysUntil(s.renewalDate)}d` : 'past due'}</span>
          </div>
        </Card>
      ))}
      {items.length === 0 && <EmptyState />}
    </div>
  );
}

export function ListView({ items, onEdit, onDelete }: ViewProps) {
  const navigate = useNavigate();
  return (
    <Card className="overflow-hidden">
      <div className="divide-y divide-slate-800">
        {items.map((s) => (
          <div key={s.id} className="px-4 py-3 flex items-center gap-4 hover:bg-slate-800/40 transition cursor-pointer" onClick={() => navigate(`/subscriptions/${s.id}`)}>
            <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-lg flex-shrink-0">{s.logo || '📦'}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-white">{s.name}</span>
                <span className="text-xs text-slate-500">{s.vendor}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className={statusColor(s.status)}>{s.status}</Badge>
                <Badge className={typeColor(s.type)}>{s.type}</Badge>
                <span className="text-xs text-slate-500">{s.category}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-medium text-white">{formatCurrency(s.cost)}<span className="text-xs text-slate-500">/{s.billingCycle}</span></p>
              <p className="text-xs text-slate-500">Renews {s.renewalDate}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => onEdit(s)} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"><Pencil size={14} /></button>
              <button onClick={() => onDelete(s)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="py-12 text-center text-slate-500 text-sm">No subscriptions match your filters.</div>}
      </div>
    </Card>
  );
}

export function TableView({ items, onEdit, onDelete }: ViewProps) {
  const navigate = useNavigate();
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Service</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Cost</th>
              <th className="text-left px-4 py-3">Cycle</th>
              <th className="text-left px-4 py-3">Renewal</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/40 cursor-pointer" onClick={() => navigate(`/subscriptions/${s.id}`)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.logo || '📦'}</span>
                    <div>
                      <p className="text-white font-medium">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.vendor}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300">{s.category}</td>
                <td className="px-4 py-3"><Badge className={typeColor(s.type)}>{s.type}</Badge></td>
                <td className="px-4 py-3"><Badge className={statusColor(s.status)}>{s.status}</Badge></td>
                <td className="px-4 py-3 text-right text-white font-medium">{formatCurrency(s.cost)}</td>
                <td className="px-4 py-3 text-slate-300">{s.billingCycle}</td>
                <td className="px-4 py-3 text-slate-300">{s.renewalDate}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEdit(s)} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"><Pencil size={14} /></button>
                    <button onClick={() => onDelete(s)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="text-center py-12 text-slate-500">No subscriptions match your filters.</div>}
      </div>
    </Card>
  );
}

export function GalleryView({ items, onEdit, onDelete }: ViewProps) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((s) => (
        <div key={s.id} className="group relative rounded-xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 hover:border-indigo-500/50 transition cursor-pointer" onClick={() => navigate(`/subscriptions/${s.id}`)}>
          <div className="aspect-square flex flex-col items-center justify-center p-4">
            <div className="text-5xl mb-3">{s.logo || '📦'}</div>
            <p className="text-sm font-semibold text-white text-center truncate w-full">{s.name}</p>
            <p className="text-xs text-slate-500 truncate w-full text-center">{s.vendor}</p>
            <p className="mt-2 text-base font-bold text-indigo-300">{formatCurrency(s.cost)}</p>
            <div className="flex gap-1 mt-2">
              <Badge className={statusColor(s.status)}>{s.status}</Badge>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => onEdit(s)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><Pencil size={16} /></button>
            <button onClick={() => onDelete(s)} className="p-2 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white"><Trash2 size={16} /></button>
          </div>
        </div>
      ))}
      {items.length === 0 && <div className="col-span-full"><EmptyState /></div>}
    </div>
  );
}

export function KanbanView({ items, onEdit, onDelete }: ViewProps) {
  const navigate = useNavigate();
  const columns = [
    { key: 'active', label: 'Active', color: 'border-emerald-500/40' },
    { key: 'paused', label: 'Paused', color: 'border-amber-500/40' },
    { key: 'cancelled', label: 'Cancelled', color: 'border-rose-500/40' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => {
        const colItems = items.filter((s) => s.status === col.key);
        return (
          <div key={col.key} className={`rounded-xl border ${col.color} bg-slate-900/40 p-3`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">{col.label}</h3>
              <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{colItems.length}</span>
            </div>
            <div className="space-y-2">
              {colItems.map((s) => (
                <div key={s.id} className="rounded-lg border border-slate-800 bg-slate-900 p-3 hover:border-slate-700 transition group cursor-pointer" onClick={() => navigate(`/subscriptions/${s.id}`)}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.logo || '📦'}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{s.name}</p>
                      <p className="text-xs text-slate-500 truncate">{s.vendor}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-indigo-300 font-medium">{formatCurrency(s.cost)}<span className="text-xs text-slate-500">/{s.billingCycle}</span></span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => onEdit(s)} className="p-1 text-slate-400 hover:text-white"><Pencil size={12} /></button>
                      <button onClick={() => onDelete(s)} className="p-1 text-slate-400 hover:text-rose-400"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{s.category} · renews {s.renewalDate}</p>
                </div>
              ))}
              {colItems.length === 0 && <p className="text-xs text-slate-500 text-center py-4">No items</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TimelineView({ items, onEdit, onDelete }: ViewProps) {
  const navigate = useNavigate();
  const sorted = [...items].sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-800" />
      <div className="space-y-4">
        {sorted.map((s) => (
          <div key={s.id} className="relative">
            <div className="absolute -left-6 top-3 h-3 w-3 rounded-full bg-indigo-500 border-2 border-slate-950" />
            <Card className="p-4 hover:border-slate-700 transition group cursor-pointer" onClick={() => navigate(`/subscriptions/${s.id}`)}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-lg flex-shrink-0">{s.logo || '📦'}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.vendor} · {s.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{formatCurrency(s.cost)}<span className="text-xs text-slate-500">/{s.billingCycle}</span></p>
                    <p className="text-xs text-slate-400">{s.renewalDate} ({daysUntil(s.renewalDate) >= 0 ? `in ${daysUntil(s.renewalDate)}d` : 'past due'})</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEdit(s)} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"><Pencil size={14} /></button>
                    <button onClick={() => onDelete(s)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Badge className={statusColor(s.status)}>{s.status}</Badge>
                <Badge className={typeColor(s.type)}>{s.type}</Badge>
              </div>
            </Card>
          </div>
        ))}
        {items.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full text-center py-12 text-slate-500 text-sm">
      No subscriptions match your filters.
    </div>
  );
}
