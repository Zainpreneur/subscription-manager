import { useState } from 'react';
import { clsx } from 'clsx';

export function Tooltip({ children, content, side = 'top' }: { children: React.ReactNode; content: string; side?: 'top' | 'bottom' }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span
          className={clsx(
            'absolute z-50 px-2 py-1 text-xs rounded bg-slate-800 text-white border border-slate-700 whitespace-nowrap shadow-lg',
            side === 'top' ? 'bottom-full mb-1 left-1/2 -translate-x-1/2' : 'top-full mt-1 left-1/2 -translate-x-1/2',
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
