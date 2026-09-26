'use client';

import React, { useState, useEffect } from 'react';
import { Printer, X, Download } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { Invoice } from '@/types';

interface InvoicePrintModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoicePrintModal({
  invoice,
  isOpen,
  onClose,
}: InvoicePrintModalProps) {
  const [bizSettings, setBizSettings] = useState({
    businessName: 'بازرگانی و انبار مرکزی',
    phone: '۰۲۱-۸۸۸۸۸۸۸۸',
    mobile: '۰۹۱۲۰۰۰۰۰۰۰',
    address: 'تهران، بازار بزرگ، مجتمع صنعتی انبار',
    bankAccount: 'IR000000000000000000000000',
    defaultTerms: '۱. اعتبار قیمت‌های مندرج در پیش‌فاکتور حداکثر ۴۸ ساعت پس از صدور می‌باشد.\n۲. بارگیری و تحویل اقلام پس از تسویه حساب نهایی انجام خواهد شد.',
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('anbar-business-settings');
      if (stored) {
        setBizSettings((prev) => ({ ...prev, ...JSON.parse(stored) }));
      }
    } catch (_) {}
  }, [isOpen]);

  if (!isOpen) return null;

  const isProforma = invoice.type === 'PROFORMA';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-auto print:shadow-none print:m-0 print:w-full print:max-w-none print:rounded-none">
        {/* Action Header (Hidden when printing) */}
        <div className="flex items-center justify-between p-4 bg-slate-100 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">
              پیش‌نمایش چاپ {isProforma ? 'پیش‌فاکتور' : 'فاکتور فروش'}
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700">
              {invoice.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ / ذخیره PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-6 sm:p-8 space-y-6 print:p-0 text-slate-900" dir="rtl">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {bizSettings.businessName}
              </h2>
              <p className="text-xs text-slate-600">
                تامین و توزیع مستقیم تجهیزات صنعتی و انبارداری
              </p>
              <div className="text-[11px] text-slate-500 space-x-2 space-x-reverse pt-1">
                <span>تلفن تماس: {bizSettings.phone}</span>
                {bizSettings.mobile && (
                  <>
                    <span>•</span>
                    <span>همراه: {bizSettings.mobile}</span>
                  </>
                )}
                <span>•</span>
                <span>نشانی: {bizSettings.address}</span>
              </div>
            </div>

            <div className="text-left space-y-1" dir="rtl">
              <div className="inline-block px-3 py-1 rounded bg-slate-900 text-white font-bold text-sm">
                {isProforma ? 'پیش‌فاکتور رسمی' : 'فاکتور قطعی فروش'}
              </div>
              <div className="text-xs text-slate-700 flex items-center justify-between gap-3">
                <span className="text-slate-500">شماره:</span>
                <span className="font-mono font-bold text-slate-900" dir="ltr">
                  {invoice.invoiceNumber}
                </span>
              </div>
              <div className="text-xs text-slate-700 flex items-center justify-between gap-3">
                <span className="text-slate-500">تاریخ صدور:</span>
                <span className="font-semibold text-slate-900">
                  {invoice.issuedDate}
                </span>
              </div>
              {invoice.dueDate && (
                <div className="text-xs text-slate-700 flex items-center justify-between gap-3">
                  <span className="text-slate-500">اعتبار تا:</span>
                  <span className="font-semibold text-slate-900">
                    {invoice.dueDate}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Buyer Information Box */}
          <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500">خریدار / مشتری: </span>
              <strong className="text-slate-900">
                {invoice.client?.name || 'مشتری گرامی (استعلام مهمان)'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500">شماره تماس: </span>
              <span className="font-mono font-medium" dir="ltr">
                {invoice.client?.phone || '—'}
              </span>
            </div>
            {invoice.client?.company && (
              <div>
                <span className="text-slate-500">نام شرکت / سازمان: </span>
                <strong className="text-slate-900">
                  {invoice.client.company}
                </strong>
              </div>
            )}
            {invoice.client?.address && (
              <div className="sm:col-span-2">
                <span className="text-slate-500">نشانی تحویل: </span>
                <span className="text-slate-800">{invoice.client.address}</span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="border border-slate-300 rounded-lg overflow-x-auto print:overflow-visible">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-300 font-bold">
                <tr>
                  <th className="p-2.5 text-center w-12">ردیف</th>
                  <th className="p-2.5">شرح کالا / اقلام درخواستی</th>
                  <th className="p-2.5 text-center">مقدار</th>
                  <th className="p-2.5 text-center">واحد</th>
                  <th className="p-2.5 text-left">مبلغ واحد (تومان)</th>
                  <th className="p-2.5 text-left">مبلغ کل (تومان)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-2.5 text-center text-slate-500 font-medium">
                      {formatNumber(idx + 1)}
                    </td>
                    <td className="p-2.5 font-bold text-slate-800">
                      {item.description}
                    </td>
                    <td className="p-2.5 text-center font-bold text-slate-900">
                      {formatNumber(item.quantity)}
                    </td>
                    <td className="p-2.5 text-center text-slate-600">
                      {item.unit}
                    </td>
                    <td className="p-2.5 text-left font-mono font-semibold" dir="ltr">
                      {formatNumber(item.unitPrice)}
                    </td>
                    <td className="p-2.5 text-left font-mono font-bold text-slate-900" dir="ltr">
                      {formatNumber(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Summary & Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start pt-2">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs text-slate-600">
              <strong className="text-slate-800 block mb-1">شرایط و توضیحات:</strong>
              <div className="whitespace-pre-line leading-relaxed text-slate-700">
                {bizSettings.defaultTerms}
              </div>
              {bizSettings.bankAccount && (
                <div className="pt-2 text-[11px] text-slate-600 font-mono" dir="ltr">
                  Bank / IBAN: <span className="font-bold text-slate-800">{bizSettings.bankAccount}</span>
                </div>
              )}
              {invoice.notes && (
                <p className="text-amber-800 font-medium pt-1">
                  نکات تکمیلی: {invoice.notes}
                </p>
              )}
            </div>

            <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>جمع کل اقلام:</span>
                <span className="font-mono font-bold" dir="ltr">
                  {formatCurrency(invoice.subtotal)}
                </span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>تخفیف ویژه:</span>
                  <span className="font-mono font-bold" dir="ltr">
                    -{formatCurrency(invoice.discount)}
                  </span>
                </div>
              )}
              {invoice.tax > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>مالیات بر ارزش افزوده:</span>
                  <span className="font-mono" dir="ltr">
                    +{formatCurrency(invoice.tax)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-extrabold text-slate-900">
                <span>مبلغ قابل پرداخت:</span>
                <span className="font-mono text-base text-amber-600" dir="ltr">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Signatures & Stamp Footer */}
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-200 text-center text-xs text-slate-600">
            <div className="space-y-12">
              <span className="font-bold block">مهر و امضای فروشنده (انبار):</span>
              <div className="h-10" />
            </div>
            <div className="space-y-12">
              <span className="font-bold block">امضای تحویل‌گیرنده / خریدار:</span>
              <div className="h-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
