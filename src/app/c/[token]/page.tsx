'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Plus,
  Minus,
  Search,
  CheckCircle2,
  ChevronDown,
  Warehouse,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  Loader2,
  PackageOpen,
  HelpCircle,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { notify } from '@/lib/notify';
import { CreateOrderRequestSchema } from '@/lib/validations';
import { useProducts, useSubmitOrderRequest } from '@/hooks';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import type { Product } from '@/types';

export default function ClientCatalogPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const [unwrappedParams, setUnwrappedParams] = React.useState<{ token: string } | null>(null);
  React.useEffect(() => {
    params.then(setUnwrappedParams);
  }, [params]);

  // TanStack Query v5 state management
  const { data: products = [], isLoading } = useProducts();
  const submitOrderMutation = useSubmitOrderRequest();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [submittedOrderNumber, setSubmittedOrderNumber] = useState<string | null>(null);

  const isSubmitting = submitOrderMutation.isPending;

  // Form states for frictionless order submission
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const token = unwrappedParams?.token ?? '';
  const isDemo = token === 'demo';

  const updateQuantity = (productId: string, delta: number, maxStock: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const nextVal = Math.max(0, Math.min(maxStock, current + delta));
      if (nextVal === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: nextVal };
    });
  };

  const setDirectQuantity = (productId: string, value: number, maxStock: number) => {
    setCart((prev) => {
      const nextVal = Math.max(0, Math.min(maxStock, value || 0));
      if (nextVal === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: nextVal };
    });
  };

  const toggleSpecs = (productId: string) => {
    setExpandedSpecs((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    'all',
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  // DOM Virtualization for ultra-smooth 60fps scrolling on mobile
  const listRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizer = useWindowVirtualizer({
    count: filteredProducts.length,
    estimateSize: () => 145,
    overscan: 6,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  // Cart summary calculations
  const totalItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const prod = products.find((p) => p.id === id);
    return sum + (prod ? prod.unitPrice * qty : 0);
  }, 0);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalItemsCount === 0) return;

    const items = Object.entries(cart).map(([productId, quantity]) => {
      const prod = products.find((p) => p.id === productId);
      return {
        productId,
        name: prod?.name || '',
        sku: prod?.sku || '',
        unit: prod?.unit || 'عدد',
        unitPrice: prod?.unitPrice || 0,
        quantity,
      };
    });

    const validation = CreateOrderRequestSchema.safeParse({
      token,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      notes: clientNotes.trim() || undefined,
      hp_company: honeypot.trim() || undefined,
      items,
    });

    if (!validation.success) {
      notify.error(validation.error.issues[0].message);
      return;
    }

    try {
      const data = await submitOrderMutation.mutateAsync(validation.data);

      setSubmittedOrderNumber(data.orderNumber);
      setIsCheckoutModalOpen(false);
      setCart({});
      notify.success(`درخواست سفارش شما با شماره ${data.orderNumber} با موفقیت ثبت شد`);
    } catch (err: any) {
      notify.error(err.message || 'خطا در ثبت درخواست');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col pb-28 transition-colors">
      {/* Mobile-Friendly Top Bar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Warehouse className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>کاتالوگ موجودی انبار</span>
                {isDemo && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-300 font-normal">
                    نسخه آزمایشی
                  </span>
                )}
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                لینک اختصاصی سفارش‌گذاری آنلاین
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/docs/client-guide.html"
              target="_blank"
              rel="noopener noreferrer"
              title="راهنمای ثبت سفارش و چاپ PDF"
              className="text-xs text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 rounded-lg border border-amber-500/30 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">راهنما</span>
            </a>
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 transition-colors"
            >
              <span>صفحه اصلی</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="max-w-2xl mx-auto px-4 pb-3 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="جستجوی نام کالا یا کد فنی..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-3 pr-9 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Categories Horizontal Scroll */}
          {categories.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as string)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-750'
                  }`}
                >
                  {cat === 'all' ? 'همه دسته‌ها' : cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-4 space-y-3.5">
        {/* Banner Notice */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-amber-600 dark:text-amber-300">سفارش مستقیم بدون نیاز به ثبت‌نام:</strong> اقلام و تعداد مدنظرتان را انتخاب کنید و دکمه «ثبت پیش‌فاکتور» را بزنید.
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center text-slate-400 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span>در حال بارگذاری کاتالوگ موجودی انبار...</span>
          </div>
        )}

        {/* Empty Catalog State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <PackageOpen className="w-8 h-8 text-slate-400 mx-auto opacity-60" />
            <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
              {search ? 'کالایی مطابق با جستجوی شما یافت نشد' : 'در حال حاضر کالایی در این کاتالوگ درج نشده است'}
            </p>
          </div>
        )}

        {/* Product Cards List (Virtualized for 60fps scrolling) */}
        {filteredProducts.length > 0 && (
          <div
            ref={listRef}
            className="relative w-full"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const product = filteredProducts[virtualRow.index];
              if (!product) return null;

              const qty = cart[product.id] || 0;
              const isCustom = Boolean(product.isCustom);
              const isOutOfStock = !isCustom && product.stockQuantity <= 0;
              const maxStock = isCustom ? 999999 : product.stockQuantity;
              const hasSpecs = product.specifications && Object.keys(product.specifications).length > 0;
              const isSpecsOpen = expandedSpecs[product.id];

              return (
                <div
                  key={product.id}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualRow.index}
                  className="absolute top-0 right-0 w-full pb-3"
                  style={{
                    transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`,
                  }}
                >
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      qty > 0
                        ? 'bg-white dark:bg-slate-900/90 border-amber-500/50 shadow-md shadow-amber-500/5'
                        : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {product.sku}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            واحد: {product.unit}
                          </span>
                          {isCustom && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                              سفارشی / ساخت بر اساس تقاضا
                            </span>
                          )}
                        </div>

                        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {product.name}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                          <div className="text-amber-600 dark:text-amber-400 font-bold">
                            {formatCurrency(product.unitPrice)}
                          </div>
                          {isCustom ? (
                            <div className="text-amber-700 dark:text-amber-300 font-medium text-[11px]">
                              {product.leadTimeText ? `زمان تحویل: ${product.leadTimeText}` : 'تولید/تامین بر اساس سفارش'}
                            </div>
                          ) : (
                            <div className="text-slate-500 dark:text-slate-400">
                              موجودی انبار:{' '}
                              <span className={product.stockQuantity < 10 ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-700 dark:text-slate-300 font-medium'}>
                                {formatNumber(product.stockQuantity)} {product.unit}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper (Mobile Optimized) */}
                      <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shrink-0">
                        <button
                          onClick={() => updateQuantity(product.id, -1, maxStock)}
                          disabled={qty <= 0}
                          aria-label="کاهش تعداد"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors active:scale-95"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <input
                          type="number"
                          min={0}
                          max={maxStock}
                          value={qty || ''}
                          placeholder="۰"
                          onChange={(e) =>
                            setDirectQuantity(product.id, parseInt(e.target.value) || 0, maxStock)
                          }
                          className="w-10 text-center font-bold text-amber-600 dark:text-amber-400 text-sm bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />

                        <button
                          onClick={() => updateQuantity(product.id, 1, maxStock)}
                          disabled={(!isCustom && qty >= product.stockQuantity) || isOutOfStock}
                          aria-label="افزایش تعداد"
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 disabled:opacity-30 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 transition-colors active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Technical Specifications */}
                    {hasSpecs && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60">
                        <button
                          onClick={() => toggleSpecs(product.id)}
                          className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors py-1"
                        >
                          <span>مشخصات فنی و استانداردهای کالا</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isSpecsOpen ? 'rotate-180 text-amber-500' : ''
                            }`}
                          />
                        </button>

                        {isSpecsOpen && (
                          <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(product.specifications!).map(([key, val]) => (
                              <div key={key} className="space-y-0.5">
                                <span className="text-[11px] text-slate-400 block">{key}:</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-200 block">{val}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Sticky Bottom Floating Action Bar */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-4 shadow-2xl">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatNumber(totalItemsCount)} قلم انتخاب شده
              </span>
              <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <button
              onClick={() => setIsCheckoutModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ثبت و صدور پیش‌فاکتور</span>
            </button>
          </div>
        </div>
      )}

      {/* Checkout / Submit Request Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>تأیید و ارسال درخواست پیش‌فاکتور</span>
              </h3>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                انصراف
              </button>
            </div>

            {/* Selected Items Summary List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {Object.entries(cart).map(([id, qty]) => {
                const item = products.find((p) => p.id === id);
                if (!item) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">{item.name}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {formatNumber(qty)} {item.unit} × {formatCurrency(item.unitPrice)}
                      </span>
                    </div>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {formatCurrency(item.unitPrice * qty)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">مجموع برآورد تقریبی:</span>
              <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            {/* Quick Contact Form */}
            <form onSubmit={handleSubmitRequest} className="space-y-3 pt-2">
              {/* Invisible Honeypot Anti-Spam Trap */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="hp_company">لطفاً این فیلد را خالی بگذارید</label>
                <input
                  type="text"
                  id="hp_company"
                  name="hp_company"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  نام و نام خانوادگی / نام شرکت
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حاج رضا کریمی"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  شماره تماس جهت هماهنگی
                </label>
                <input
                  type="tel"
                  required
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 text-left font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  توضیحات و نحوه تحویل (اختیاری)
                </label>
                <textarea
                  rows={2}
                  placeholder="آدرس، زمان ترجیحی بارگیری یا هرگونه نکته تکمیلی..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال ارسال درخواست...</span>
                  </>
                ) : (
                  <span>ارسال نهایی درخواست پیش‌فاکتور</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Submission Success Dialog */}
      {submittedOrderNumber && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                درخواست شما با موفقیت ثبت گردید
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                پیش‌فاکتور برای شما صادر و توسط مسئول انبار در اسرع وقت بررسی خواهد شد.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>کد پیگیری درخواست:</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                {submittedOrderNumber}
              </span>
            </div>

            <button
              onClick={() => {
                setSubmittedOrderNumber(null);
                setCart({});
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
            >
              بازگشت به کاتالوگ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
