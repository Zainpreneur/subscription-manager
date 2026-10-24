import { Plus, Trash2, Pencil } from 'lucide-react';

interface Column { key: string; label: string; render?: (row: any) => React.ReactNode; }

interface Props {
  label: string;
  items: any[];
  columns: Column[];
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onRemove?: (row: any) => void;
  emptyText?: string;
}

export function One2ManyField({ label, items, columns, onAdd, onEdit, onRemove, emptyText = 'No records.' }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-slate-400">{label}</label>
        {onAdd && <button type="button" onClick={onAdd} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><Plus size={12} /> Add</button>}
      </div>
      <div className="rounded-lg border border-slate-800 overflow-hidden">
        {items.length === 0 ? (
          <p className="text-xs text-slate-500 px-3 py-4 text-center">{emptyText}</p>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-slate-900/80 text-slate-400">
              <tr>{columns.map((c) => <th key={c.key} className="text-left px-3 py-2">{c.label}</th>)}{(onEdit || onRemove) && <th className="px-3 py-2" />}</tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {items.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-slate-800/40">
                  {columns.map((c) => <td key={c.key} className="px-3 py-2 text-slate-300">{c.render ? c.render(row) : row[c.key]}</td>)}
                  {(onEdit || onRemove) && (
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex gap-1">
                        {onEdit && <button type="button" onClick={() => onEdit(row)} className="text-slate-400 hover:text-white"><Pencil size={12} /></button>}
                        {onRemove && <button type="button" onClick={() => onRemove(row)} className="text-slate-400 hover:text-rose-400"><Trash2 size={12} /></button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
