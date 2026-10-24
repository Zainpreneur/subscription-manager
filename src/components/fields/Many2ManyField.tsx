import { useState, useRef, useEffect } from 'react';
import { Input } from '../ui/Field';
import { Plus, X } from 'lucide-react';

interface Option { id: string; label: string; }

interface Props {
  label: string;
  value: string[];
  onChange: (ids: string[]) => void;
  options: Option[];
  help?: string;
}

export function Many2ManyField({ label, value, onChange, options, help }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const selected = options.filter((o) => value.includes(o.id));
  const available = options.filter((o) => !value.includes(o.id) && o.label.toLowerCase().includes(q.toLowerCase()));

  const add = (id: string) => { onChange([...value, id]); setQ(''); };
  const remove = (id: string) => onChange(value.filter((v) => v !== id));

  return (
    <div ref={ref} className="relative">
      <label className="text-xs text-slate-400 mb-1 block">{label}</label>
      <div className="min-h-[42px] rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 flex flex-wrap gap-1.5 items-center cursor-text" onClick={() => setOpen(true)}>
        {selected.map((o) => (
          <span key={o.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-600/20 text-indigo-300 text-xs border border-indigo-500/30">
            {o.label}
            <button type="button" onClick={(e) => { e.stopPropagation(); remove(o.id); }} className="hover:text-white"><X size={10} /></button>
          </span>
        ))}
        <span className="text-slate-500 text-xs flex items-center gap-1"><Plus size={12} /> add</span>
      </div>
      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
          <div className="p-2 border-b border-slate-800">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." autoFocus />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {available.length === 0 && <p className="text-xs text-slate-500 px-3 py-2">No options.</p>}
            {available.map((o) => (
              <button key={o.id} type="button" onClick={() => add(o.id)} className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 transition">
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {help && <p className="text-[11px] text-slate-500 mt-1">{help}</p>}
    </div>
  );
}
