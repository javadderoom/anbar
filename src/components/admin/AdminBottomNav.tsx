import React from 'react';
import { Boxes, Link2, Clock } from 'lucide-react';
import type { AdminTab } from './AdminSidebar';

interface AdminBottomNavProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  hasPendingRequests: boolean;
}

export default function AdminBottomNav({
  activeTab,
  setActiveTab,
  hasPendingRequests,
}: AdminBottomNavProps) {
  return (
    <nav
      aria-label="ناوبری اصلی موبایل"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="max-w-md mx-auto px-4 py-2 grid grid-cols-3 gap-1">
        {/* Tab 1: Inventory */}
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-2xl transition-all active:scale-95 ${
            activeTab === 'inventory'
              ? 'text-amber-400 bg-amber-500/10 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Boxes className={`w-5 h-5 transition-transform ${activeTab === 'inventory' ? 'scale-110' : ''}`} />
          <span className="text-[11px] leading-tight">انبار و کالاها</span>
        </button>

        {/* Tab 2: Client Links */}
        <button
          onClick={() => setActiveTab('links')}
          className={`flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-2xl transition-all active:scale-95 ${
            activeTab === 'links'
              ? 'text-amber-400 bg-amber-500/10 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Link2 className={`w-5 h-5 transition-transform ${activeTab === 'links' ? 'scale-110' : ''}`} />
          <span className="text-[11px] leading-tight">لینک‌های مشتری</span>
        </button>

        {/* Tab 3: Requests & Invoices */}
        <button
          onClick={() => setActiveTab('requests')}
          className={`relative flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-2xl transition-all active:scale-95 ${
            activeTab === 'requests'
              ? 'text-amber-400 bg-amber-500/10 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Clock className={`w-5 h-5 transition-transform ${activeTab === 'requests' ? 'scale-110' : ''}`} />
            {hasPendingRequests && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
            )}
          </div>
          <span className="text-[11px] leading-tight">درخواست‌ها</span>
        </button>
      </div>
    </nav>
  );
}
