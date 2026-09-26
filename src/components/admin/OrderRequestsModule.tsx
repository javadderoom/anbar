'use client';

import React from 'react';
import { Printer, Check } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
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
}

export default function OrderRequestsModule({
  requests,
  setRequests,
  setProducts,
  onOpenPrintPreview,
}: OrderRequestsModuleProps) {
  // Convert Request to Final Invoice (Auto Deduct Stock)
  const handleConvertToInvoice = (req: OrderRequestItem) => {
    // 1. Mark request as converted
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'CONVERTED' } : r))
    );

    // 2. Decrement stock from products
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

    alert(`فاکتور قطعی برای سفارش ${req.orderNumber} با موفقیت صادر شد و مقادیر مربوطه از موجودی انبار کسر گردید.`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white">سفارش‌ها و درخواست‌های پیش‌فاکتور دریافتی</h3>
        <p className="text-xs text-slate-400">
          درخواست‌هایی که مشتریان از طریق لینک‌های اختصاصی خود ثبت کرده‌اند.
        </p>
      </div>

      {requests.length === 0 && (
        <div className="p-8 text-center text-slate-400 text-xs rounded-2xl border border-slate-800 bg-slate-900/40">
          درخواستی در سامانه ثبت نشده است.
        </div>
      )}

      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {req.orderNumber}
                </span>
                <span className="font-bold text-white text-sm">
                  {req.clientName}
                </span>
                <span className="text-xs text-slate-400 font-mono" dir="ltr">
                  ({req.phone})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{req.date}</span>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                    req.status === 'PENDING'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {req.status === 'PENDING' ? 'در انتظار بررسی' : 'تبدیل به فاکتور قطعی شده'}
                </span>
              </div>
            </div>

            {/* List of items in request */}
            <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
              {req.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs text-slate-300"
                >
                  <span>
                    • {item.description} ({formatNumber(item.quantity)} {item.unit})
                  </span>
                  <span className="font-mono font-bold text-amber-400" dir="ltr">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-4 text-xs text-slate-300">
                <span>تعداد اقلام: {formatNumber(req.itemsCount)} نوع کالا</span>
                <span>
                  مبلغ تقریبی:{' '}
                  <strong className="text-amber-400">
                    {formatCurrency(req.totalEstimate)}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenPrintPreview(req, 'PROFORMA')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs hover:bg-slate-700 active:scale-95 transition-all"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>چاپ پیش‌فاکتور (PDF)</span>
                </button>

                {req.status === 'PENDING' ? (
                  <button
                    onClick={() => handleConvertToInvoice(req)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>تایید و صدور فاکتور قطعی</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onOpenPrintPreview(req, 'SALES')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs hover:bg-blue-500/30"
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-400" />
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
