import { useState, useRef, useEffect } from 'react';
import { Input } from '../ui/Field';
import { ChevronDown, X } from 'lucide-react';

interface Option { id: string; label: string; subtitle?: string; }

interface Props {
  label: string;
  value: string;
  onChange: (id: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  help?: string;
}

export function Many2OneField({ label, value, onChange, options, placeholder = 'Select...', required, help }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.id === value);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const filtered = options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()) || (o.subtitle || '').toLowerCase().includes(q.toLowerCase()));

  return (
    <div ref={ref} className="relative">
      <label className="text-xs text-slate-400 mb-1 block">{label}{required && <span className="text-rose-400"> *</span>}</label>
      <div
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 cursor-pointer flex items-center justify-between"
      >
        {selected ? (
          <span className="truncate">{selected.label}{selected.subtitle && <span className="text-slate-500 ml-2 text-xs">{selected.subtitle}</span>}</span>
        ) : (
          <span className="text-slate-500">{placeholder}</span>
        )}
        <div className="flex items-center gap-1">
          {value && <button type="button" onClick={(e) => { e.stopPropagation(); onChange(''); }} className="text-slate-500 hover:text-white"><X size={12} /></button>}
          <ChevronDown size={14} className="text-slate-500" />
        </div>
      </div>
      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
          <div className="p-2 border-b border-slate-800">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." autoFocus />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 && <p className="text-xs text-slate-500 px-3 py-2">No matches.</p>}
            {filtered.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => { onChange(o.id); setOpen(false); setQ(''); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-800 transition ${o.id === value ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-200'}`}
              >
                <div className="font-medium">{o.label}</div>
                {o.subtitle && <div className="text-xs text-slate-500">{o.subtitle}</div>}
              </button>
            ))}
          </div>
        </div>
      )}
      {help && <p className="text-[11px] text-slate-500 mt-1">{help}</p>}
    </div>
  );
}
