'use client';

import React, { useState } from 'react';
import { Printer, Check, Inbox, Loader2 } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { notify } from '@/lib/notify';
import type { Product, Invoice } from '@/types';

export interface OrderRequestItem {
  id: string;
  orderNumber: string;
  clientName: string;
  phone: string;
  itemsCount: number;
  totalEstimate: number;
  status: 'PENDING' | 'CONVERTED' | 'REJECTED';
  date: string;
  notes?: string;
  items: {
    id: string;
    productId: string;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
  }[];
}

interface OrderRequestsModuleProps {
  requests: OrderRequestItem[];
  setRequests: React.Dispatch<React.SetStateAction<OrderRequestItem[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onOpenPrintPreview: (req: OrderRequestItem, type: 'PROFORMA' | 'SALES') => void;
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
}

export default function OrderRequestsModule({
  requests,
  setRequests,
  setProducts,
  onOpenPrintPreview,
  isLoading = false,
  onRefresh,
}: OrderRequestsModuleProps) {
  const [convertingId, setConvertingId] = useState<string | null>(null);

  // Convert Request to Final Invoice (Auto Deduct Stock via DB Transaction)
  const handleConvertToInvoice = async (req: OrderRequestItem) => {
    const confirmed = await notify.confirm({
      title: 'صدور فاکتور قطعی و کسر موجودی',
      message: `آیا از تأیید سفارش ${req.orderNumber} مربوط به «${req.clientName}» و کسر اقلام از انبار اطمینان دارید؟`,
      confirmText: 'تأیید و صدور فاکتور',
    });

    if (!confirmed) return;

    try {
      setConvertingId(req.id);
      const res = await fetch(`/api/requests/${req.id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deductStock: true }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در تبدیل سفارش به فاکتور');
      }

      // Update state locally
      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: 'CONVERTED' } : r))
      );

      // Decrement stock in local product list
      setProducts((prevProducts) =>
        prevProducts.map((prod) => {
          const matchingItem = req.items.find((item) => item.productId === prod.id);
          if (matchingItem) {
            const updatedStock = Math.max(0, prod.stockQuantity - matchingItem.quantity);
            return { ...prod, stockQuantity: updatedStock };
          }
          return prod;
        })
      );

      if (onRefresh) await onRefresh();

      notify.success(
        `فاکتور قطعی برای سفارش ${req.orderNumber} با موفقیت صادر شد و مقادیر مربوطه از موجودی انبار در دیتابیس کسر گردید.`
      );
    } catch (err: any) {
      notify.error(err.message || 'خطا در صدور فاکتور قطعی');
    } finally {
      setConvertingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          سفارش‌ها و استعلام‌های پیش‌فاکتور دریافتی
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          درخواست‌هایی که مشتریان بدون ثبت‌نام از طریق کاتالوگ لینک اختصاصی خود ثبت کرده‌اند.
        </p>
      </div>

      {/* Loading state */}
      {isLoading && requests.length === 0 && (
        <div className="p-12 text-center text-slate-400 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          <span>در حال بارگذاری درخواست‌ها از پایگاه داده...</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && requests.length === 0 && (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
          <Inbox className="w-8 h-8 text-slate-400 mx-auto opacity-60" />
          <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
            درخواستی در سامانه ثبت نشده است
          </p>
          <p className="text-[11px] text-slate-500">
            با ارسال لینک کاتالوگ به خریداران، درخواست‌های استعلام و سفارش آن‌ها در این بخش نمایش داده خواهند شد.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-slate-300 dark:hover:border-slate-750 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {req.orderNumber}
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {req.clientName}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono" dir="ltr">
                  ({req.phone})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">{req.date}</span>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    req.status === 'PENDING'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {req.status === 'PENDING' ? 'در انتظار بررسی' : 'فاکتور قطعی صادر شده'}
                </span>
              </div>
            </div>

            {/* List of items in request */}
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800/60">
              {req.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300"
                >
                  <span>
                    • {item.description} ({formatNumber(item.quantity)} {item.unit})
                  </span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400" dir="ltr">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                <span>تعداد اقلام: {formatNumber(req.itemsCount)} نوع کالا</span>
                <span>
                  مبلغ تخمینی:{' '}
                  <strong className="text-amber-600 dark:text-amber-400">
                    {formatCurrency(req.totalEstimate)}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenPrintPreview(req, 'PROFORMA')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs active:scale-95 transition-all"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>چاپ پیش‌فاکتور</span>
                </button>

                {req.status === 'PENDING' ? (
                  <button
                    onClick={() => handleConvertToInvoice(req)}
                    disabled={convertingId === req.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    {convertingId === req.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>تایید و صدور فاکتور قطعی</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenPrintPreview(req, 'SALES')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30 text-xs active:scale-95 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                    <span>چاپ فاکتور نهایی فروش</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
