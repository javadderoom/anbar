'use client';

import React, { useState, useEffect } from 'react';
import { Printer, X, Download, FileText, CheckCircle2, Building2, UserCheck } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { formatPersianCurrencyWords } from '@/lib/number-to-words';
import type { Invoice } from '@/types';

interface InvoicePrintModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

interface BizSettings {
  businessName: string;
  phone: string;
  mobile: string;
  nationalId: string;
  economicCode: string;
  postalCode: string;
  address: string;
  bankAccount: string;
  taxPercent: number;
  proformaValidityHours: number;
  defaultTerms: string;
}

const DEFAULT_BIZ_SETTINGS: BizSettings = {
  businessName: 'بازرگانی و انبار مرکزی',
  phone: '۰۲۱-۸۸۸۸۸۸۸۸',
  mobile: '۰۹۱۲۰۰۰۰۰۰۰',
  nationalId: '',
  economicCode: '',
  postalCode: '',
  address: 'تهران، بازار بزرگ، مجتمع صنعتی انبار',
  bankAccount: 'IR000000000000000000000000',
  taxPercent: 0,
  proformaValidityHours: 48,
  defaultTerms: '۱. اعتبار قیمت‌های مندرج در پیش‌فاکتور حداکثر ۴۸ ساعت پس از صدور می‌باشد.\n۲. بارگیری و تحویل اقلام پس از تسویه حساب نهایی انجام خواهد شد.',
};

export default function InvoicePrintModal({
  invoice,
  isOpen,
  onClose,
}: InvoicePrintModalProps) {
  const [bizSettings, setBizSettings] = useState<BizSettings>(DEFAULT_BIZ_SETTINGS);
  const [includeVat, setIncludeVat] = useState(false);
  const [vatRate, setVatRate] = useState(10); // Standard Iranian VAT rate (10%)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('anbar-business-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setBizSettings((prev) => ({ ...prev, ...parsed }));
        if (parsed.taxPercent && parsed.taxPercent > 0) {
          setIncludeVat(true);
          setVatRate(parsed.taxPercent);
        }
      }
    } catch (_) {}
  }, [isOpen]);

  if (!isOpen) return null;

  const isProforma = invoice.type === 'PROFORMA';
  const subtotal = invoice.subtotal || 0;
  const discount = invoice.discount || 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const vatAmount = includeVat ? Math.round((taxableAmount * vatRate) / 100) : (invoice.tax || 0);
  const netPayable = taxableAmount + vatAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-auto print:shadow-none print:m-0 print:w-full print:max-w-none print:rounded-none">
        
        {/* Modal Action Header (Hidden during printing) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold">
              پیش‌نمایش چاپ {isProforma ? 'پیش‌فاکتور رسمی' : 'صورتحساب فروش کالا و خدمات'}
            </span>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-bold" dir="ltr">
              {invoice.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* VAT Toggle Control */}
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={includeVat}
                onChange={(e) => setIncludeVat(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
              <span className="text-slate-300 font-medium">
                محاسبه مالیات ارزش افزوده ({formatNumber(vatRate)}٪)
              </span>
            </label>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ / ذخیره PDF (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Invoice Document Area (A4 Layout) */}
        <div className="p-6 sm:p-8 space-y-4 print:p-0 text-slate-900 bg-white" dir="rtl">
          
          {/* Header Bar */}
          <div className="border-2 border-slate-900 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* National Crest / Company Identity */}
            <div className="text-right space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {bizSettings.businessName}
              </h1>
              <p className="text-xs font-semibold text-slate-600">
                مرکز تامین، توزیع و لجستیک اقلام و تجهیزات صنعتی
              </p>
            </div>

            {/* Document Title Badge */}
            <div className="text-center px-4 py-1.5 rounded-xl bg-slate-100 border border-slate-300">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isProforma ? 'پیش‌فاکتور فروش کالا و خدمات' : 'صورتحساب رسمی فروش کالا و خدمات'}
              </h2>
              <span className="text-[10px] text-slate-500 block">
                مطابق با ماده ۱۶۹ و ۱۶۹ مکرر قانون مالیات‌های مستقیم
              </span>
            </div>

            {/* Metadata (Number, Date, Due) */}
            <div className="text-left space-y-1 text-xs" dir="rtl">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 font-medium">شماره سریال:</span>
                <span className="font-mono font-black text-slate-950 text-sm" dir="ltr">
                  {invoice.invoiceNumber}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 font-medium">تاریخ صدور:</span>
                <span className="font-semibold text-slate-900" dir="ltr">
                  {invoice.issuedDate}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 font-medium">اعتبار پیش‌فاکتور:</span>
                <span className="font-semibold text-slate-900">
                  {bizSettings.proformaValidityHours} ساعت
                </span>
              </div>
            </div>
          </div>

          {/* Seller & Buyer Two-Column Identification Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* 1. مشخصات فروشنده */}
            <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/70 space-y-2">
              <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-200 font-bold text-slate-900">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>مشخصات فروشنده (انبار و تامین‌کننده)</span>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                <div>
                  <span className="text-slate-500 text-[11px] block">نام شخص حقیقی/حقوقی:</span>
                  <strong className="text-slate-900 font-bold block">{bizSettings.businessName}</strong>
                </div>

                <div>
                  <span className="text-slate-500 text-[11px] block">تلفن تماس:</span>
                  <span className="font-mono text-slate-900 block" dir="ltr">{bizSettings.phone || bizSettings.mobile || '—'}</span>
                </div>

                {bizSettings.nationalId && (
                  <div>
                    <span className="text-slate-500 text-[11px] block">شناسه / کد ملی:</span>
                    <span className="font-mono text-slate-900 block" dir="ltr">{bizSettings.nationalId}</span>
                  </div>
                )}

                {bizSettings.economicCode && (
                  <div>
                    <span className="text-slate-500 text-[11px] block">شماره اقتصادی:</span>
                    <span className="font-mono text-slate-900 block" dir="ltr">{bizSettings.economicCode}</span>
                  </div>
                )}

                {bizSettings.postalCode && (
                  <div className="col-span-2">
                    <span className="text-slate-500 text-[11px] block">کد پستی ۱۰ رقمی:</span>
                    <span className="font-mono text-slate-900 block" dir="ltr">{bizSettings.postalCode}</span>
                  </div>
                )}

                <div className="col-span-2">
                  <span className="text-slate-500 text-[11px] block">نشانی انبار و بارگیری:</span>
                  <span className="text-slate-800 block leading-tight">{bizSettings.address || 'تهران'}</span>
                </div>
              </div>
            </div>

            {/* 2. مشخصات خریدار */}
            <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/70 space-y-2">
              <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-200 font-bold text-slate-900">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>مشخصات خریدار / متقاضی</span>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                <div>
                  <span className="text-slate-500 text-[11px] block">نام خریدار / شرکت:</span>
                  <strong className="text-slate-900 font-bold block">
                    {invoice.client?.name || 'مشتری گرامی (استعلام مهمان)'}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 text-[11px] block">شماره تماس خریدار:</span>
                  <span className="font-mono text-slate-900 font-medium block" dir="ltr">
                    {invoice.client?.phone || '—'}
                  </span>
                </div>

                {invoice.client?.company && (
                  <div className="col-span-2">
                    <span className="text-slate-500 text-[11px] block">نام سازمان / کارگاه:</span>
                    <span className="text-slate-900 font-semibold block">{invoice.client.company}</span>
                  </div>
                )}

                <div className="col-span-2">
                  <span className="text-slate-500 text-[11px] block">نشانی و مقصد تحویل:</span>
                  <span className="text-slate-800 block leading-tight">
                    {invoice.client?.address || 'تحویل درب انبار مرکزی'}
                  </span>
                </div>

                <div className="col-span-2 pt-1 text-[11px] text-slate-500">
                  <span>وضعیت حساب: </span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {isProforma ? 'در انتظار تأیید و تسویه' : 'تسویه و صادر شده'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-2 border-slate-900 rounded-xl overflow-x-auto print:overflow-visible">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-900 border-b-2 border-slate-900 font-bold">
                <tr>
                  <th className="p-2.5 text-center w-10 border-l border-slate-300">ردیف</th>
                  <th className="p-2.5 border-l border-slate-300">شرح کالا یا خدمات</th>
                  <th className="p-2.5 text-center w-16 border-l border-slate-300">تعداد</th>
                  <th className="p-2.5 text-center w-16 border-l border-slate-300">واحد</th>
                  <th className="p-2.5 text-left w-28 border-l border-slate-300">مبلغ واحد (تومان)</th>
                  <th className="p-2.5 text-left w-32">مبلغ کل (تومان)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-2 text-center text-slate-600 font-medium border-l border-slate-200">
                      {formatNumber(idx + 1)}
                    </td>
                    <td className="p-2 font-bold text-slate-900 border-l border-slate-200">
                      {item.description}
                    </td>
                    <td className="p-2 text-center font-bold text-slate-900 border-l border-slate-200">
                      {formatNumber(item.quantity)}
                    </td>
                    <td className="p-2 text-center text-slate-600 border-l border-slate-200">
                      {item.unit}
                    </td>
                    <td className="p-2 text-left font-mono font-medium border-l border-slate-200" dir="ltr">
                      {formatNumber(item.unitPrice)}
                    </td>
                    <td className="p-2 text-left font-mono font-bold text-slate-950" dir="ltr">
                      {formatNumber(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Summary & Persian Words Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start pt-1">
            {/* Terms & Bank details */}
            <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 space-y-2 text-xs">
              <strong className="text-slate-900 block font-bold">شرایط و مقررات تحویل:</strong>
              <div className="whitespace-pre-line leading-relaxed text-slate-700 text-[11px]">
                {bizSettings.defaultTerms}
              </div>

              {bizSettings.bankAccount && (
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-700">
                  <span className="font-semibold block text-slate-800 mb-0.5">اطلاعات واریز و شماره شبا:</span>
                  <span className="font-mono font-bold bg-white px-2 py-1 rounded border border-slate-300 inline-block text-slate-900" dir="ltr">
                    {bizSettings.bankAccount}
                  </span>
                </div>
              )}

              {invoice.notes && (
                <div className="pt-1 text-[11px] text-amber-900 bg-amber-50/80 p-2 rounded border border-amber-200">
                  <strong>یادداشت سفارش:</strong> {invoice.notes}
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span>جمع کل اقلام (ناخالص):</span>
                <span className="font-mono font-bold" dir="ltr">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center text-emerald-700">
                  <span>مجموع تخفیف‌های اعمال شده:</span>
                  <span className="font-mono font-bold" dir="ltr">
                    -{formatCurrency(discount)}
                  </span>
                </div>
              )}

              {includeVat && (
                <div className="flex justify-between items-center text-slate-700 border-t border-slate-200 pt-1.5">
                  <span>مالیات بر ارزش افزوده ({formatNumber(vatRate)}٪):</span>
                  <span className="font-mono font-bold text-slate-900" dir="ltr">
                    +{formatCurrency(vatAmount)}
                  </span>
                </div>
              )}

              {/* Net Payable Row */}
              <div className="flex justify-between items-center border-t-2 border-slate-900 pt-2 text-sm font-black text-slate-950">
                <span>مبلغ کل قابل پرداخت:</span>
                <span className="font-mono text-base text-amber-600 dark:text-amber-600 font-black" dir="ltr">
                  {formatCurrency(netPayable)}
                </span>
              </div>

              {/* Amount in Persian Words */}
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-700">
                <span className="font-semibold text-slate-800">مبلغ به حروف: </span>
                <span className="font-bold text-slate-950 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {formatPersianCurrencyWords(netPayable)}
                </span>
              </div>
            </div>
          </div>

          {/* Official Signatures & Stamp Footer */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-slate-300 text-center text-xs text-slate-700">
            <div className="space-y-14">
              <span className="font-bold block text-slate-900">مهر و امضای مجاز فروشنده (انبار):</span>
              <div className="h-10" />
            </div>
            <div className="space-y-14">
              <span className="font-bold block text-slate-900">امضا و تایید تحویل‌گیرنده / خریدار:</span>
              <div className="h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Embedded High-Fidelity Print CSS */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          body {
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide non-print UI overlays */
          header, nav, aside, footer, button, .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
