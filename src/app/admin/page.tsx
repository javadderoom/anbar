'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Warehouse,
  Boxes,
  Link2,
  FileText,
  FileSpreadsheet,
  Plus,
  Copy,
  Check,
  Search,
  ExternalLink,
  ChevronLeft,
  ArrowRight,
  TrendingDown,
  Clock,
  Printer,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: number;
  stockQuantity: number;
  minStockAlert: number;
}

interface ClientLinkItem {
  id: string;
  token: string;
  clientName: string;
  phone?: string;
  createdDate: string;
  requestCount: number;
  isActive: boolean;
}

interface OrderRequestItem {
  id: string;
  orderNumber: string;
  clientName: string;
  phone: string;
  itemsCount: number;
  totalEstimate: number;
  status: 'PENDING' | 'CONVERTED' | 'REJECTED';
  date: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'links' | 'requests' | 'invoices'>('inventory');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Sample State for Interactive Demo
  const [products, setProducts] = useState<ProductItem[]>([
    { id: '1', sku: 'ANB-101', name: 'لوله فولادی گالوانیزه ۲ اینچ', category: 'لوله‌ها', unit: 'شاخه ۶ متری', unitPrice: 1850000, stockQuantity: 45, minStockAlert: 10 },
    { id: '2', sku: 'ANB-102', name: 'شیر فلکه کشویی برنجی ۱ اینچ', category: 'اتصالات', unit: 'عدد', unitPrice: 420000, stockQuantity: 120, minStockAlert: 20 },
    { id: '3', sku: 'ANB-103', name: 'فلنج جوشی گلودار کلاس ۱۵۰', category: 'فلنج‌ها', unit: 'عدد', unitPrice: 950000, stockQuantity: 8, minStockAlert: 15 },
    { id: '4', sku: 'ANB-104', name: 'واشر لاستیکی منجیددار فشار قوی', category: 'اتصالات', unit: 'بسته ۵۰ تایی', unitPrice: 320000, stockQuantity: 65, minStockAlert: 15 },
    { id: '5', sku: 'ANB-105', name: 'الکترود جوشکاری ۶۰۱۳ سایز ۳.۲', category: 'ابزار', unit: 'بسته ۵ کیلویی', unitPrice: 680000, stockQuantity: 4, minStockAlert: 10 },
  ]);

  const [links, setLinks] = useState<ClientLinkItem[]>([
    { id: 'l1', token: 'reza-steel', clientName: 'حاج رضا کریمی (فولاد غرب)', phone: '۰۹۱۲۳۴۵۶۷۸۹', createdDate: '۱۴۰۳/۰۷/۰۱', requestCount: 3, isActive: true },
    { id: 'l2', token: 'pars-oil-99', clientName: 'شرکت نفت و گاز پارس', phone: '۰۹۱۸۱۱۱۲۲۳۳', createdDate: '۱۴۰۳/۰۷/۰۳', requestCount: 1, isActive: true },
    { id: 'l3', token: 'guest-open-01', clientName: 'لینک عمومی خریداران استعلامی', phone: 'عمومی / مهمان', createdDate: '۱۴۰۳/۰۷/۰۴', requestCount: 7, isActive: true },
  ]);

  const [requests, setRequests] = useState<OrderRequestItem[]>([
    { id: 'r1', orderNumber: 'REQ-1042', clientName: 'حاج رضا کریمی (فولاد غرب)', phone: '۰۹۱۲۳۴۵۶۷۸۹', itemsCount: 4, totalEstimate: 14600000, status: 'PENDING', date: 'امروز، ۱۰:۴۵' },
    { id: 'r2', orderNumber: 'REQ-1041', clientName: 'پیمانکاری سپهر', phone: '۰۹۳۵۰۰۰۱۱۲۲', itemsCount: 2, totalEstimate: 3700000, status: 'CONVERTED', date: 'دیروز، ۱۶:۲۰' },
  ]);

  // Link generation form state
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [isCreatingLink, setIsCreatingLink] = useState(false);

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

  const handleConvertToInvoice = (reqId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'CONVERTED' } : r))
    );
  };

  const lowStockCount = products.filter((p) => p.stockQuantity <= p.minStockAlert).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Warehouse className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <span>پنل مدیریت هوشمند انبار</span>
              </h1>
              <p className="text-[11px] text-amber-400 font-medium">
                سیستم انبارداری، لینک‌های اختصاصی و پیش‌فاکتور
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60"
            >
              <span>خروج به صفحه اصلی</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">کل کالاهای فعال</span>
              <span className="text-lg font-bold text-white">
                {formatNumber(products.length)} کالا
              </span>
            </div>
          </div>

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

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">لینک‌های اختصاصی فعال</span>
              <span className="text-lg font-bold text-white">
                {formatNumber(links.length)} لینک
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">درخواست‌های پیش‌فاکتور</span>
              <span className="text-lg font-bold text-white">
                {formatNumber(requests.filter((r) => r.status === 'PENDING').length)} در انتظار
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar text-sm">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>موجودی و انبارداری</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === 'links'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>لینک‌های اختصاصی مشتریان</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === 'requests'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>درخواست‌های ثبت‌شده</span>
            {requests.some((r) => r.status === 'PENDING') && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20">
                  <Plus className="w-4 h-4" />
                  <span>ثبت کالای جدید</span>
                </button>

                <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-200 text-xs">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>ورود از اکسل (Excel)</span>
                </button>

                <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-200 text-xs">
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>خروجی اکسل</span>
                </button>
              </div>
            </div>

            {/* Inventory Table (Responsive) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">کد کالا</th>
                      <th className="p-3.5">نام و مشخصات کالا</th>
                      <th className="p-3.5">دسته</th>
                      <th className="p-3.5">واحد</th>
                      <th className="p-3.5">قیمت واحد</th>
                      <th className="p-3.5">موجودی انبار</th>
                      <th className="p-3.5 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {products.map((p) => {
                      const isLow = p.stockQuantity <= p.minStockAlert;
                      return (
                        <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-3.5 font-mono text-slate-300 font-medium">
                            {p.sku}
                          </td>
                          <td className="p-3.5 font-bold text-white">
                            {p.name}
                          </td>
                          <td className="p-3.5 text-slate-400">{p.category}</td>
                          <td className="p-3.5 text-slate-400">{p.unit}</td>
                          <td className="p-3.5 font-bold text-amber-400">
                            {formatCurrency(p.unitPrice)}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold ${
                                isLow
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400'
                              }`}
                            >
                              {formatNumber(p.stockQuantity)} {p.unit}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <button className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold px-2 py-1 rounded bg-amber-500/10">
                              ویرایش
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLIENT MAGIC LINKS */}
        {activeTab === 'links' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">لینک‌های اختصاصی اشتراک کاتالوگ</h3>
                <p className="text-xs text-slate-400">
                  این لینک‌ها را برای مشتریان بفرستید تا بدون نیاز به لاگین یا ثبت‌نام، موجودی را دیده و ثبت سفارش کنند.
                </p>
              </div>

              <button
                onClick={() => setIsCreatingLink(!isCreatingLink)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
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
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
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
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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

                    <div className="flex items-center gap-3 text-xs text-slate-400">
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
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs border border-slate-700 transition-colors"
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
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs border border-amber-500/30 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>مشاهده کاتالوگ</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INCOMING REQUESTS & PROFORMA */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">سفارش‌ها و درخواست‌های پیش‌فاکتور دریافتی</h3>
              <p className="text-xs text-slate-400">
                درخواست‌هایی که مشتریان از طریق لینک‌های اختصاصی خود ثبت کرده‌اند.
              </p>
            </div>

            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {req.orderNumber}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {req.clientName}
                      </span>
                      <span className="text-xs text-slate-400">
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
                        {req.status === 'PENDING' ? 'در انتظار بررسی' : 'تبدیل به فاکتور شده'}
                      </span>
                    </div>
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
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs hover:bg-slate-700">
                        <Printer className="w-3.5 h-3.5 text-slate-400" />
                        <span>چاپ پیش‌فاکتور (PDF)</span>
                      </button>

                      {req.status === 'PENDING' && (
                        <button
                          onClick={() => handleConvertToInvoice(req.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>تایید و صدور فاکتور قطعی</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
