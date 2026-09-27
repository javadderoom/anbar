'use client';

import React, { useState } from 'react';
import { X, Plus, Minus, ArrowRight, Loader2, PackageCheck, AlertCircle, Layers } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { notify } from '@/lib/notify';
import { useAdjustStock } from '@/hooks';
import type { Product } from '@/types';

interface StockAdjustModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AdjustMode = 'IN' | 'OUT' | 'DIRECT';

const PRESET_REASONS: Record<AdjustMode, string[]> = {
  IN: ['ورود محموله جدید به انبار', 'مرجوعی از خریدار', 'اصلاح کسری قبلی'],
  OUT: ['ضایعات و خرابی کالا', 'مصرف داخلی و نمونه', 'اصلاح فزونی قبلی'],
  DIRECT: ['انبارگردانی دوره‌ای', 'شمارش پایان فصل', 'مغایرت‌گیری انبار'],
};

export default function StockAdjustModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: StockAdjustModalProps) {
  const [mode, setMode] = useState<AdjustMode>('IN');
  const [amount, setAmount] = useState<string>('1');
  const [directNewTotal, setDirectNewTotal] = useState<string>('');
  const [reason, setReason] = useState<string>('ورود محموله جدید به انبار');
  const [customReason, setCustomReason] = useState<string>('');

  const adjustStockMutation = useAdjustStock();
  const isSubmitting = adjustStockMutation.isPending;

  if (!isOpen || !product) return null;

  const currentStock = product.stockQuantity;
  const numAmount = parseInt(amount, 10) || 0;
  const numDirectTotal = parseInt(directNewTotal, 10) || 0;

  // Calculate delta & new stock
  let delta = 0;
  let calculatedNewStock = currentStock;

  if (mode === 'IN') {
    delta = Math.max(1, numAmount);
    calculatedNewStock = currentStock + delta;
  } else if (mode === 'OUT') {
    delta = -Math.max(1, numAmount);
    calculatedNewStock = Math.max(0, currentStock + delta);
  } else {
    calculatedNewStock = Math.max(0, numDirectTotal);
    delta = calculatedNewStock - currentStock;
  }

  const finalReason = customReason.trim() ? customReason.trim() : reason;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (delta === 0) {
      notify.warning('تغییری در موجودی کالا اعمال نشده است');
      return;
    }

    if (calculatedNewStock < 0) {
      notify.error('موجودی انبار نمی‌تواند کمتر از صفر باشد');
      return;
    }

    try {
      await adjustStockMutation.mutateAsync({
        productId: product.id,
        data: {
          deltaQuantity: delta,
          type: mode === 'DIRECT' ? 'ADJUSTMENT' : mode,
          reason: finalReason,
        },
      });

      notify.success(
        `موجودی «${product.name}» با موفقیت به ${formatNumber(calculatedNewStock)} ${product.unit} اصلاح شد`
      );
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      notify.error(err.message || 'خطا در اصلاح موجودی کالا');
    }
  };

  const setQuickAmount = (val: number) => {
    if (mode === 'DIRECT') {
      setDirectNewTotal(String(val));
    } else {
      setAmount(String(val));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-all animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                اصلاح سریع موجودی انبار
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Current Stock Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              موجودی فعلی در سامانه:
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">
              {formatNumber(currentStock)} {product.unit}
            </span>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode('IN');
                setReason(PRESET_REASONS.IN[0]);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'IN'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>افزایش (+)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('OUT');
                setReason(PRESET_REASONS.OUT[0]);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'OUT'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
              <span>کاهش (-)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('DIRECT');
                setDirectNewTotal(String(currentStock));
                setReason(PRESET_REASONS.DIRECT[0]);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'DIRECT'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>انبارگردانی (=)</span>
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {mode === 'DIRECT' ? 'موجودی دقیق جدید پس از شمارش:' : 'تعداد تغییر موجودی:'}
            </label>

            <div className="relative">
              <input
                type="number"
                min="0"
                required
                value={mode === 'DIRECT' ? directNewTotal : amount}
                onChange={(e) => {
                  if (mode === 'DIRECT') {
                    setDirectNewTotal(e.target.value);
                  } else {
                    setAmount(e.target.value);
                  }
                }}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono text-left"
                dir="ltr"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                {product.unit}
              </span>
            </div>

            {/* Quick buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 ml-1">میانبر:</span>
              {[1, 5, 10, 20, 50, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setQuickAmount(mode === 'DIRECT' ? val : val)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-[11px] font-mono text-slate-700 dark:text-slate-300 transition-colors"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              علت ثبت گردش انبار:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_REASONS[mode].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setReason(r);
                    setCustomReason('');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-right transition-all ${
                    reason === r && !customReason
                      ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="یا دلیل سفارشی دیگر را تایپ کنید..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all mt-1"
            />
          </div>

          {/* Calculation & Summary Result */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">میزان تغییر خالص:</span>
              <span
                className={`font-mono font-bold text-sm ${
                  delta > 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : delta < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-600'
                }`}
                dir="ltr"
              >
                {delta > 0 ? `+${formatNumber(delta)}` : formatNumber(delta)} {product.unit}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-500/20 font-bold">
              <span className="text-slate-900 dark:text-white">موجودی نهایی پس از ثبت:</span>
              <span className="font-mono text-base text-amber-700 dark:text-amber-300" dir="ltr">
                {formatNumber(calculatedNewStock)} {product.unit}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={isSubmitting || delta === 0}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال ثبت گردش انبار...</span>
                </>
              ) : (
                <span>تأیید و ذخیره موجودی</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
