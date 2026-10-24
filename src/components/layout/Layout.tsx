import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, MobileSidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/Toast';
import { CommandPalette } from '../ui/CommandPalette';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastContainer />
      <CommandPalette />
    </div>
  );
}
