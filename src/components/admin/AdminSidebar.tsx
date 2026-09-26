import React from 'react';
import Link from 'next/link';
import { Warehouse, Boxes, Link2, Clock, Settings, ArrowRight, ShieldCheck } from 'lucide-react';

export type AdminTab = 'inventory' | 'links' | 'requests' | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingRequestsCount: number;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  pendingRequestsCount,
}: AdminSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 border-l border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl h-screen sticky top-0 p-5 shrink-0 z-30 select-none transition-colors">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3 pb-6 border-b border-slate-200 dark:border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
          <Warehouse className="w-5 h-5" />
        </div>
        <div>
          <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white block">
            سامانه انبار
          </span>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold tracking-wider uppercase block">
            Admin Workspace
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 space-y-1.5" aria-label="ناوبری دسکتاپ پنل ادمین">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          مدیریت اصلی
        </div>

        {/* Tab 1: Inventory */}
        <button
          onClick={() => setActiveTab('inventory')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'inventory'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <Boxes className="w-4 h-4" />
            <span>موجودی و کالاها</span>
          </div>
        </button>

        {/* Tab 2: Client Links */}
        <button
          onClick={() => setActiveTab('links')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'links'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <Link2 className="w-4 h-4" />
            <span>لینک‌های اختصاصی</span>
          </div>
        </button>

        {/* Tab 3: Requests */}
        <button
          onClick={() => setActiveTab('requests')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'requests'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4" />
            <span>سفارش‌ها و درخواست‌ها</span>
          </div>

          {pendingRequestsCount > 0 && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'requests'
                  ? 'bg-slate-950 text-amber-400'
                  : 'bg-rose-500 text-white animate-pulse'
              }`}
            >
              {pendingRequestsCount}
            </span>
          )}
        </button>

        {/* Tab 4: Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4" />
            <span>تنظیمات سامانه</span>
          </div>
        </button>
      </nav>

      {/* Footer / System Status */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center gap-2.5 text-[11px] text-slate-600 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>پایگاه داده نئون متصل</span>
        </div>

        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all"
        >
          <span>خروج به صفحه اصلی</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
