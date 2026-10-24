import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Calendar, BarChart3, Settings as SettingsIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/subscriptions', label: 'Subscriptions', icon: Package },
  { to: '/calendar', label: 'Renewal Calendar', icon: Calendar },
  { to: '/analytics', label: 'Analytics & Spend', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside
      className={clsx(
        'hidden md:flex flex-col border-r border-slate-800 bg-slate-950/80 transition-all duration-200',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className="flex items-center gap-2 px-4 h-16 border-b border-slate-800">
        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">S</div>
        {!collapsed && <span className="font-semibold text-white tracking-tight">SubManager</span>}
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60',
              )
            }
          >
            <item.icon size={18} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <button onClick={onToggle} className="m-2 p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="md:hidden fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <aside className="absolute left-0 top-0 bottom-0 w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="flex items-center gap-2 px-4 h-16 border-b border-slate-800">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">S</div>
          <span className="font-semibold text-white">SubManager</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={onClose}
              className={({ isActive }) => clsx('flex items-center gap-3 px-3 py-2 rounded-lg text-sm', isActive ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/60')}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
}
