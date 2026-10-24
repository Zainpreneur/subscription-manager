import { useToastStore } from '../../store/useToastStore';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

export function ToastContainer() {
  const { toasts, remove } = useToastStore();
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={clsx(
            'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl backdrop-blur fade-in',
            t.type === 'success' && 'bg-emerald-900/80 border-emerald-700 text-emerald-100',
            t.type === 'error' && 'bg-rose-900/80 border-rose-700 text-rose-100',
            t.type === 'info' && 'bg-slate-900/80 border-slate-700 text-slate-100',
          )}
        >
          {t.type === 'success' && <CheckCircle2 size={18} />}
          {t.type === 'error' && <XCircle size={18} />}
          {t.type === 'info' && <Info size={18} />}
          <span className="text-sm flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="text-white/60 hover:text-white"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}
