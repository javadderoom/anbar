import React from 'react';
import Link from 'next/link';
import { Warehouse, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>پنل مدیریت هوشمند انبار</span>
            </h1>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              سامانه اختصاصی انبارداری، لینک‌های اشتراک کاتالوگ و صدور پیش‌فاکتور
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <Link
            href="/"
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 transition-colors"
          >
            <span>صفحه اصلی</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
