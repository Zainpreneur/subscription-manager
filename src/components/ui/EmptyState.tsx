import { Inbox } from 'lucide-react';

export function EmptyState({ title = 'Nothing here yet', description = 'Try adjusting your filters or add a new item.', action }: { title?: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="mx-auto h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
        <Inbox size={28} className="text-slate-500" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
