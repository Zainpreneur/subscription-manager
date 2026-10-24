import { Select } from '../ui/Field';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; color?: string }[];
  required?: boolean;
  help?: string;
}

export function SelectionField({ label, value, onChange, options, required, help }: Props) {
  return (
    <div>
      <label className="text-xs text-slate-400 mb-1 block">{label}{required && <span className="text-rose-400"> *</span>}</label>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </Select>
      {help && <p className="text-[11px] text-slate-500 mt-1">{help}</p>}
    </div>
  );
}
