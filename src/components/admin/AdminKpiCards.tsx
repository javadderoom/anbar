import React from 'react';
import { Boxes, AlertTriangle, Link2, FileText } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface AdminKpiCardsProps {
  productsCount: number;
  lowStockCount: number;
  linksCount: number;
  pendingRequestsCount: number;
}

export default function AdminKpiCards({
  productsCount,
  lowStockCount,
  linksCount,
  pendingRequestsCount,
}: AdminKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Products */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
          <Boxes className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block">کل کالاهای فعال</span>
          <span className="text-lg font-bold text-white">
            {formatNumber(productsCount)} کالا
          </span>
        </div>
      </div>

      {/* 2. Low Stock Alerts */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block">هشدار کسری موجودی</span>
          <span className="text-lg font-bold text-rose-400">
            {formatNumber(lowStockCount)} کالا
          </span>
        </div>
      </div>

      {/* 3. Active Links */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
          <Link2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block">لینک‌های اختصاصی</span>
          <span className="text-lg font-bold text-white">
            {formatNumber(linksCount)} لینک
          </span>
        </div>
      </div>

      {/* 4. Pending Requests */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block">پیش‌فاکتورهای در انتظار</span>
          <span className="text-lg font-bold text-white">
            {formatNumber(pendingRequestsCount)} سفارش
          </span>
        </div>
      </div>
    </div>
  );
}
