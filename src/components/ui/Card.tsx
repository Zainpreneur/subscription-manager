import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx('px-5 py-4 border-b border-slate-800', className)}>{children}</div>;
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx('px-5 py-4', className)}>{children}</div>;
}
