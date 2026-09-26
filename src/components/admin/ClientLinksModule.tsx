'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Copy, Check, ExternalLink } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export interface ClientLinkItem {
  id: string;
  token: string;
  clientName: string;
  phone?: string;
  createdDate: string;
  requestCount: number;
  isActive: boolean;
}

interface ClientLinksModuleProps {
  links: ClientLinkItem[];
  setLinks: React.Dispatch<React.SetStateAction<ClientLinkItem[]>>;
}

export default function ClientLinksModule({
  links,
  setLinks,
}: ClientLinksModuleProps) {
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopyLink = (token: string) => {
    const fullUrl = `${window.location.origin}/c/${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName) return;
    const generatedToken = 'cli-' + Math.random().toString(36).substring(2, 8);
    const newEntry: ClientLinkItem = {
      id: 'l-' + Date.now(),
      token: generatedToken,
      clientName: newClientName,
      phone: newClientPhone || 'ثبت نشده',
      createdDate: 'امروز',
      requestCount: 0,
      isActive: true,
    };
    setLinks([newEntry, ...links]);
    setNewClientName('');
    setNewClientPhone('');
    setIsCreatingLink(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white">لینک‌های اختصاصی اشتراک کاتالوگ</h3>
          <p className="text-xs text-slate-400">
            این لینک‌ها را برای خریداران بفرستید تا بدون نیاز به لاگین یا ثبت‌نام، کاتالوگ را بررسی کرده و درخواست پیش‌فاکتور ثبت کنند.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingLink(!isCreatingLink)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>تولید لینک جدید</span>
        </button>
      </div>

      {/* Create Link Form */}
      {isCreatingLink && (
        <form
          onSubmit={handleCreateLink}
          className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3"
        >
          <h4 className="text-xs font-bold text-amber-400">مشخصات خریدار یا مشتری</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                نام مشتری یا عنوان لینک
              </label>
              <input
                type="text"
                required
                placeholder="مثال: بازرگانی نوین یا خریدار محترم"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                شماره تماس مشتری (اختیاری)
              </label>
              <input
                type="tel"
                placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-left font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingLink(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-750"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
            >
              ساخت لینک اختصاصی
            </button>
          </div>
        </form>
      )}

      {/* Links List */}
      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  {link.clientName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  فعال
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                <span>شماره: {link.phone}</span>
                <span>تاریخ ایجاد: {link.createdDate}</span>
                <span>سفارش‌های ثبت شده: {formatNumber(link.requestCount)}</span>
              </div>

              <div className="text-xs text-amber-400/90 font-mono flex items-center gap-1.5 pt-1" dir="ltr">
                <span className="text-slate-500 font-sans">لینک:</span>
                <span>/c/{link.token}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleCopyLink(link.token)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs border border-slate-700 transition-colors active:scale-95"
              >
                {copiedToken === link.token ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی لینک</span>
                  </>
                )}
              </button>

              <Link
                href={`/c/${link.token}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs border border-amber-500/30 transition-colors active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>مشاهده کاتالوگ</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
