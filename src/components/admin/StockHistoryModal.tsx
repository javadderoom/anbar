'use client';

import React from 'react';
import { X, History, TrendingUp, TrendingDown, RefreshCw, Loader2, Calendar, User } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useProductMovements } from '@/hooks';
import type { Product, StockMovementType } from '@/types';

interface StockHistoryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StockHistoryModal({
  product,
  isOpen,
  onClose,
}: StockHistoryModalProps) {
  const { data: movements = [], isLoading } = useProductMovements(
    product?.id || '',
    isOpen && !!product
  );

  if (!isOpen || !product) return null;

  const getTypeBadge = (type: StockMovementType) => {
    switch (type) {
      case 'IN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-3 h-3" />
            <span>ورود</span>
          </span>
        );
      case 'OUT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <TrendingDown className="w-3 h-3" />
            <span>خروج</span>
          </span>
        );
      case 'ADJUSTMENT':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <RefreshCw className="w-3 h-3" />
            <span>انبارگردانی</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-all animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>دفتر کل گردش موجودی و انبارگردانی</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-mono" dir="ltr">
                {product.sku} — {product.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Stock Summary */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            موجودی فعلی در انبار:
          </span>
          <span className="font-bold font-mono text-sm text-amber-600 dark:text-amber-400" dir="ltr">
            {formatNumber(product.stockQuantity)} {product.unit}
          </span>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {isLoading && (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              <span>در حال بارگذاری سوابق گردش کالا...</span>
            </div>
          )}

          {!isLoading && movements.length === 0 && (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <History className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                هنوز هیچ گردش انباری برای این کالا ثبت نشده است
              </p>
              <p className="text-[11px] text-slate-500">
                با صدور فاکتور یا اصلاح سریع موجودی، تمام تغییرات به صورت خودکار در این دفتر ثبت می‌شوند.
              </p>
            </div>
          )}

          {!isLoading && movements.length > 0 && (
            <div className="space-y-2.5">
              {movements.map((m) => {
                const dateFormatted = new Intl.DateTimeFormat('fa-IR', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(m.createdAt));

                const isPositive = m.deltaQuantity > 0;

                return (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-750 transition-all shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getTypeBadge(m.type)}
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {m.reason || 'اصلاح موجودی انبار'}
                        </span>
                      </div>

                      <span
                        className={`font-mono font-bold text-sm ${
                          isPositive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                        dir="ltr"
                      >
                        {isPositive ? `+${formatNumber(m.deltaQuantity)}` : formatNumber(m.deltaQuantity)}{' '}
                        {product.unit}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{dateFormatted}</span>
                        </span>

                        {m.userName && (
                          <span className="flex items-center gap-1 text-[11px]">
                            <User className="w-3.5 h-3.5" />
                            <span>{m.userName}</span>
                          </span>
                        )}
                      </div>

                      <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300" dir="ltr">
                        <span>{formatNumber(m.previousStock)}</span>
                        <span className="mx-1 text-slate-400">➔</span>
                        <strong className="text-slate-900 dark:text-white">{formatNumber(m.newStock)}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
}
