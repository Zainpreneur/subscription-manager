import { useMemo } from 'react';

export function DonutChart({ data, size = 160 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const segments = useMemo(() => {
    let offset = 0;
    return data.map((d) => {
      const frac = d.value / total;
      const len = frac * circumference;
      const seg = { ...d, dash: `${len} ${circumference - len}`, offset: -offset };
      offset += len;
      return seg;
    });
  }, [data, total, circumference]);

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={16} />
        {segments.map((s, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth={16}
            strokeDasharray={s.dash}
            strokeDashoffset={s.offset}
            strokeLinecap="butt"
          />
        ))}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-sm font-bold" transform={`rotate(90 ${size / 2} ${size / 2})`}>
          {Math.round(total)}
        </text>
      </svg>
      <div className="flex-1 space-y-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
            <span className="text-slate-300 truncate flex-1">{d.label}</span>
            <span className="text-slate-400">{Math.round((d.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
