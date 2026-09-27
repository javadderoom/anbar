'use client';

import React from 'react';
import Link from 'next/link';
import { Warehouse, ArrowRight, LogOut, Shield, BookOpen } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export default function AdminHeader() {
  const { user, role, roleName, logout } = useAuth();

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
          {/* User & Bitmask Role Badge */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user.name || user.email.split('@')[0]}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span>{roleName}</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400" dir="ltr">({role})</span>
                </div>
              </div>
            </div>
          )}

          {/* Guide Link */}
          <a
            href="/docs/user-guide.html"
            target="_blank"
            rel="noopener noreferrer"
            title="مشاهده راهنمای جامع سامانه و دانلود PDF"
            className="text-xs text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">راهنمای سامانه</span>
          </a>

          <ThemeToggle />

          {/* Logout Button */}
          {user && (
            <button
              onClick={() => logout()}
              title="خروج از حساب کاربری"
              className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">خروج</span>
            </button>
          )}

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
