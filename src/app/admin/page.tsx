'use client';

import React, { useState, useRef } from 'react';
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
  Upload,
  X,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { exportProductsToExcelFile, parseProductsFromExcelFile } from '@/lib/excel';
import InvoicePrintModal from '@/components/InvoicePrintModal';
import type { Product, Invoice } from '@/types';

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

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'links' | 'requests'>('inventory');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample initial inventory
  const [products, setProducts] = useState<Product[]>([
    { id: 'p1', sku: 'ANB-101', name: 'لوله فولادی گالوانیزه ۲ اینچ', category: 'لوله‌ها', unit: 'شاخه ۶ متری', unitPrice: 1850000, stockQuantity: 45, minStockAlert: 10, isActive: true },
    { id: 'p2', sku: 'ANB-102', name: 'شیر فلکه کشویی برنجی ۱ اینچ', category: 'اتصالات', unit: 'عدد', unitPrice: 420000, stockQuantity: 120, minStockAlert: 20, isActive: true },
    { id: 'p3', sku: 'ANB-103', name: 'فلنج جوشی گلودار کلاس ۱۵۰', category: 'فلنج‌ها', unit: 'عدد', unitPrice: 950000, stockQuantity: 8, minStockAlert: 15, isActive: true },
    { id: 'p4', sku: 'ANB-104', name: 'واشر لاستیکی منجیددار فشار قوی', category: 'اتصالات', unit: 'بسته ۵۰ تایی', unitPrice: 320000, stockQuantity: 65, minStockAlert: 15, isActive: true },
    { id: 'p5', sku: 'ANB-105', name: 'الکترود جوشکاری ۶۰۱۳ سایز ۳.۲', category: 'ابزار', unit: 'بسته ۵ کیلویی', unitPrice: 680000, stockQuantity: 4, minStockAlert: 10, isActive: true },
  ]);

  const [links, setLinks] = useState<ClientLinkItem[]>([
    { id: 'l1', token: 'reza-steel', clientName: 'حاج رضا کریمی (فولاد غرب)', phone: '۰۹۱۲۳۴۵۶۷۸۹', createdDate: '۱۴۰۳/۰۷/۰۱', requestCount: 3, isActive: true },
    { id: 'l2', token: 'pars-oil-99', clientName: 'شرکت نفت و گاز پارس', phone: '۰۹۱۸۱۱۱۲۲۳۳', createdDate: '۱۴۰۳/۰۷/۰۳', requestCount: 1, isActive: true },
    { id: 'l3', token: 'guest-open-01', clientName: 'لینک عمومی خریداران استعلامی', phone: 'عمومی / مهمان', createdDate: '۱۴۰۳/۰۷/۰۴', requestCount: 7, isActive: true },
  ]);

  const [requests, setRequests] = useState<OrderRequestItem[]>([
    {
      id: 'r1',
      orderNumber: 'REQ-1042',
      clientName: 'حاج رضا کریمی (فولاد غرب)',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      itemsCount: 2,
      totalEstimate: 14750000,
      status: 'PENDING',
      date: 'امروز، ۱۰:۴۵',
      items: [
        { id: 'ri1', productId: 'p1', description: 'لوله فولادی گالوانیزه ۲ اینچ', quantity: 5, unit: 'شاخه ۶ متری', unitPrice: 1850000, totalPrice: 9250000 },
        { id: 'ri2', productId: 'p3', description: 'فلنج جوشی گلودار کلاس ۱۵۰', quantity: 6, unit: 'عدد', unitPrice: 950000, totalPrice: 5700000 },
      ],
    },
    {
      id: 'r2',
      orderNumber: 'REQ-1041',
      clientName: 'پیمانکاری سپهر',
      phone: '۰۹۳۵۰۰۰۱۱۲۲',
      itemsCount: 1,
      totalEstimate: 3360000,
      status: 'CONVERTED',
      date: 'دیروز، ۱۶:۲۰',
      items: [
        { id: 'ri3', productId: 'p2', description: 'شیر فلکه کشویی برنجی ۱ اینچ', quantity: 8, unit: 'عدد', unitPrice: 420000, totalPrice: 3360000 },
      ],
    },
  ]);

  // Modal States
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    category: '',
    unit: 'عدد',
    unitPrice: 0,
    stockQuantity: 0,
    minStockAlert: 5,
  });

  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  // Invoice Print Preview Modal State
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);

  // File input ref for Excel import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Excel Export Handler
  const handleExportExcel = () => {
    exportProductsToExcelFile(products);
  };

  // Excel Import Handler
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedRows = await parseProductsFromExcelFile(file);
      const newImportedProducts: Product[] = parsedRows.map((row, idx) => ({
        id: 'p-imp-' + Date.now() + '-' + idx,
        sku: row.sku,
        name: row.name,
        category: row.category || 'دسته‌بندی نشده',
        unit: row.unit,
        unitPrice: row.unitPrice,
        stockQuantity: row.stockQuantity,
        minStockAlert: row.minStockAlert || 5,
        isActive: true,
      }));

      setProducts((prev) => [...newImportedProducts, ...prev]);
      alert(`تعداد ${parsedRows.length} کالا از فایل اکسل با موفقیت وارد سامانه شد.`);
    } catch (err) {
      alert('خطا در خواندن فایل اکسل. لطفاً ساختار ستون‌های فایل را بررسی کنید.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku) return;

    const created: Product = {
      id: 'p-' + Date.now(),
      sku: newProduct.sku,
      name: newProduct.name,
      category: newProduct.category || 'دسته‌بندی نشده',
      unit: newProduct.unit,
      unitPrice: Number(newProduct.unitPrice),
      stockQuantity: Number(newProduct.stockQuantity),
      minStockAlert: Number(newProduct.minStockAlert),
      isActive: true,
    };

    setProducts([created, ...products]);
    setIsAddProductOpen(false);
    setNewProduct({
      sku: '',
      name: '',
      category: '',
      unit: 'عدد',
      unitPrice: 0,
      stockQuantity: 0,
      minStockAlert: 5,
    });
  };

  // Copy Magic Link
  const handleCopyLink = (token: string) => {
    const fullUrl = `${window.location.origin}/c/${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Create Magic Link
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

  // Open Invoice Preview
  const handleOpenPrintPreview = (req: OrderRequestItem, type: 'PROFORMA' | 'SALES' = 'PROFORMA') => {
    const invoiceData: Invoice = {
      id: 'inv-' + req.id,
      invoiceNumber: type === 'PROFORMA' ? `PRO-${req.orderNumber}` : `INV-${req.orderNumber}`,
      type,
      status: type === 'PROFORMA' ? 'ISSUED' : 'PAID',
      client: {
        id: 'c-req',
        name: req.clientName,
        phone: req.phone,
        isGuest: true,
        createdAt: req.date,
        updatedAt: req.date,
      },
      orderRequestId: req.id,
      subtotal: req.totalEstimate,
      discount: 0,
      tax: 0,
      total: req.totalEstimate,
      issuedDate: '۱۴۰۳/۰۷/۰۵',
      dueDate: '۱۴۰۳/۰۷/۰۸',
      items: req.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        description: i.description,
        unit: i.unit,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice,
      })),
    };

    setSelectedInvoiceForPrint(invoiceData);
  };

  const lowStockCount = products.filter((p) => p.stockQuantity <= p.minStockAlert).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hidden file input for Excel upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportExcel}
        accept=".xlsx, .xls, .csv"
        className="hidden"
      />

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Warehouse className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <span>پنل مدیریت هوشمند انبار</span>
              </h1>
              <p className="text-[11px] text-amber-400 font-medium">
                سامانه اختصاصی انبارداری، لینک‌های اشتراک کاتالوگ و صدور پیش‌فاکتور
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 transition-colors"
            >
              <span>صفحه اصلی</span>
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
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>ثبت کالای جدید</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-200 text-xs active:scale-95 transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>ورود از اکسل (Excel)</span>
                </button>

                <button
                  onClick={handleExportExcel}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-200 text-xs active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>خروجی اکسل</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="جستجوی کد، نام یا دسته..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Empty Search Result */}
            {filteredProducts.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs rounded-2xl border border-slate-800 bg-slate-900/40">
                کالایی با این مشخصات یافت نشد.
              </div>
            )}

            {/* Mobile View: Touch-Friendly Product Cards (hidden on md and above) */}
            <div className="md:hidden space-y-3">
              {filteredProducts.map((p) => {
                const isLow = p.stockQuantity <= p.minStockAlert;
                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 space-y-3 transition-all shadow-md"
                  >
                    {/* Header Row: SKU, Category, Alert Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300" dir="ltr">
                          {p.sku}
                        </span>
                        {p.category && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800/60 text-slate-400">
                            {p.category}
                          </span>
                        )}
                      </div>

                      {isLow ? (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>نیازمند تامین</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          موجودی کافی
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {p.name}
                    </h3>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-slate-400 text-[11px] block">قیمت واحد:</span>
                        <strong className="text-amber-400 font-bold block">
                          {formatCurrency(p.unitPrice)}
                        </strong>
                      </div>

                      <div className="space-y-0.5 text-left" dir="rtl">
                        <span className="text-slate-400 text-[11px] block">موجودی انبار:</span>
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            isLow ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {formatNumber(p.stockQuantity)} {p.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Full Table (hidden on mobile, visible on md and above) */}
            <div className="hidden md:block rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">کد کالا</th>
                      <th className="p-3.5">نام کالا</th>
                      <th className="p-3.5">دسته</th>
                      <th className="p-3.5">واحد</th>
                      <th className="p-3.5">قیمت واحد</th>
                      <th className="p-3.5">موجودی انبار</th>
                      <th className="p-3.5 text-center">وضعیت هشدار</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProducts.map((p) => {
                      const isLow = p.stockQuantity <= p.minStockAlert;
                      return (
                        <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-3.5 font-mono text-slate-300 font-medium" dir="ltr">
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
                            {isLow ? (
                              <span className="text-[11px] text-rose-400 font-medium flex items-center justify-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>نیازمند تامین</span>
                              </span>
                            ) : (
                              <span className="text-[11px] text-emerald-400 font-medium">
                                کافی
                              </span>
                            )}
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition-all"
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
                          \u200E{formatNumber(item.totalPrice)} تومان
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
                        onClick={() => handleOpenPrintPreview(req, 'PROFORMA')}
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
                          <span>تایید و صدور فاکتور قطعی (کسر از انبار)</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenPrintPreview(req, 'SALES')}
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
        )}
      </main>

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-amber-400" />
                <span>ثبت کالای جدید در انبار</span>
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">کد کالا (SKU)</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ANB-106"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">نام کالا</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: زانو ۹۰ درجه جوشی"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">دسته‌بندی</label>
                  <input
                    type="text"
                    placeholder="مثال: اتصالات"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">واحد سنجش</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: عدد / شاخه"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">قیمت واحد (تومان)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="۰"
                    value={newProduct.unitPrice || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">موجودی انبار</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="۰"
                    value={newProduct.stockQuantity || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">حداقل موجودی هشدار</label>
                <input
                  type="number"
                  min={1}
                  placeholder="۵"
                  value={newProduct.minStockAlert || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, minStockAlert: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-750"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
                >
                  ذخیره کالا
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Print Preview Modal */}
      {selectedInvoiceForPrint && (
        <InvoicePrintModal
          invoice={selectedInvoiceForPrint}
          isOpen={!!selectedInvoiceForPrint}
          onClose={() => setSelectedInvoiceForPrint(null)}
        />
      )}
    </div>
  );
}
