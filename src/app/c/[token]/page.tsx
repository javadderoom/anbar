'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

// Sample inventory items for demo & client preview
const initialProducts = [
  {
    id: 'prod-1',
    sku: 'ANB-101',
    name: 'لوله فولادی گالوانیزه ۲ اینچ',
    category: 'لوله‌ها',
    unit: 'شاخه ۶ متری',
    unitPrice: 1850000,
    stockQuantity: 45,
    specifications: { 'ضخامت': '۲.۵ میلی‌متر', 'استاندارد': 'DIN 2440', 'پوشش': 'گالوانیزه گرم' },
  },
  {
    id: 'prod-2',
    sku: 'ANB-102',
    name: 'شیر فلکه کشویی برنجی ۱ اینچ',
    category: 'اتصالات و شیرآلات',
    unit: 'عدد',
    unitPrice: 420000,
    stockQuantity: 120,
    specifications: { 'جنس بدنه': 'برنج فورج', 'فشار کاری': 'PN16', 'نوع اتصال': 'دنده‌ای' },
  },
  {
    id: 'prod-3',
    sku: 'ANB-103',
    name: 'فلنج جوشی گلودار کلاس ۱۵۰',
    category: 'فلنج‌ها',
    unit: 'عدد',
    unitPrice: 950000,
    stockQuantity: 18,
    specifications: { 'سایز': '۳ اینچ', 'متریال': 'ASTM A105', 'کلاس': 'Class 150' },
  },
  {
    id: 'prod-4',
    sku: 'ANB-104',
    name: 'واشر لاستیکی منجیددار فشار قوی',
    category: 'آب‌بندی و اتصالات',
    unit: 'بسته ۵۰ عددی',
    unitPrice: 320000,
    stockQuantity: 65,
    specifications: { 'ضخامت': '۳ میلی‌متر', 'مقاومت حرارتی': 'تا ۱۲۰ درجه', 'جنس': 'EPDM' },
  },
  {
    id: 'prod-5',
    sku: 'ANB-105',
    name: 'الکترود جوشکاری ۶۰۱۳ سایز ۳.۲',
    category: 'ابزار و جوشکاری',
    unit: 'بسته ۵ کیلوگرمی',
    unitPrice: 680000,
    stockQuantity: 80,
    specifications: { 'استاندارد': 'AWS E6013', 'برند': 'آما', 'نوع جریان': 'AC / DC' },
  },
];

export default function ClientCatalogPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const [unwrappedParams, setUnwrappedParams] = React.useState<{ token: string } | null>(null);
  React.useEffect(() => {
    params.then(setUnwrappedParams);
  }, [params]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form states for frictionless order submission
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  const token = unwrappedParams?.token ?? 'demo';
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
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(initialProducts.map((p) => p.category)))];

  // Cart summary calculations
  const totalItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const prod = initialProducts.find((p) => p.id === id);
    return sum + (prod ? prod.unitPrice * qty : 0);
  }, 0);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setIsCheckoutModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-28">
      {/* Mobile-Friendly Top Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Warehouse className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>کاتالوگ موجودی انبار</span>
                {isDemo && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-normal">
                    نسخه آزمایشی
                  </span>
                )}
              </h1>
              <p className="text-[11px] text-slate-400">
                لینک اختصاصی سفارش‌گذاری آنلاین
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60"
          >
            <span>صفحه اصلی</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Search & Category Filter */}
        <div className="max-w-2xl mx-auto px-4 pb-3 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="جستجوی نام کالا یا کد فنی..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-3 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 border border-slate-750'
                }`}
              >
                {cat === 'all' ? 'همه دسته‌ها' : cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-4 space-y-3.5">
        {/* Banner Notice */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-300">سفارش مستقیم بدون نیاز به ثبت‌نام:</strong> اقلام و تعداد مدنظرتان را انتخاب کنید و دکمه «ثبت پیش‌فاکتور» را بزنید.
          </div>
        </div>

        {/* Product Cards List */}
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const qty = cart[product.id] || 0;
            const isOutOfStock = product.stockQuantity <= 0;
            const hasSpecs = product.specifications && Object.keys(product.specifications).length > 0;
            const isSpecsOpen = expandedSpecs[product.id];

            return (
              <div
                key={product.id}
                className={`p-4 rounded-2xl border transition-all ${
                  qty > 0
                    ? 'bg-slate-900/90 border-amber-500/50 shadow-md shadow-amber-500/5'
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {product.sku}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        واحد: {product.unit}
                      </span>
                    </div>

                    <h2 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {product.name}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <div className="text-amber-400 font-bold">
                        {formatCurrency(product.unitPrice)}
                      </div>
                      <div className="text-slate-400">
                        موجودی انبار:{' '}
                        <span className={product.stockQuantity < 10 ? 'text-amber-400 font-semibold' : 'text-slate-300 font-medium'}>
                          {formatNumber(product.stockQuantity)} {product.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper (Mobile Optimized) */}
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(product.id, -1, product.stockQuantity)}
                      disabled={qty <= 0 || isOutOfStock}
                      aria-label="کاهش تعداد"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <input
                      type="number"
                      min={0}
                      max={product.stockQuantity}
                      value={qty || ''}
                      placeholder="۰"
                      onChange={(e) =>
                        setDirectQuantity(product.id, parseInt(e.target.value) || 0, product.stockQuantity)
                      }
                      className="w-10 text-center font-bold text-amber-400 text-sm bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <button
                      onClick={() => updateQuantity(product.id, 1, product.stockQuantity)}
                      disabled={qty >= product.stockQuantity || isOutOfStock}
                      aria-label="افزایش تعداد"
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 disabled:opacity-30 disabled:bg-slate-800 disabled:text-slate-400 transition-colors active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expandable Specifications Button */}
                {hasSpecs && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/60">
                    <button
                      onClick={() => toggleSpecs(product.id)}
                      className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <span>مشخصات فنی و استانداردهای محصول</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isSpecsOpen ? 'rotate-180 text-amber-400' : ''
                        }`}
                      />
                    </button>

                    {isSpecsOpen && (
                      <div className="mt-2.5 grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px]">
                        {Object.entries(product.specifications).map(([key, val]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-slate-500">{key}:</span>
                            <span className="text-slate-300 font-medium">{String(val)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Sticky Bottom Floating Action Bar */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 p-4 shadow-2xl">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">
                {formatNumber(totalItemsCount)} قلم انتخاب شده
              </span>
              <span className="text-base font-extrabold text-amber-400">
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
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>تایید و ارسال درخواست پیش‌فاکتور</span>
              </h3>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-slate-800"
              >
                انصراف
              </button>
            </div>

            {/* Selected Items Summary List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {Object.entries(cart).map(([id, qty]) => {
                const item = initialProducts.find((p) => p.id === id);
                if (!item) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950 border border-slate-800/80"
                  >
                    <div>
                      <span className="font-semibold text-slate-200 block">{item.name}</span>
                      <span className="text-slate-400 text-[11px]">
                        {formatNumber(qty)} {item.unit} × {formatCurrency(item.unitPrice)}
                      </span>
                    </div>
                    <span className="font-bold text-amber-400">
                      {formatCurrency(item.unitPrice * qty)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-slate-950 flex items-center justify-between text-sm">
              <span className="text-slate-400">مجموع برآورد تقریبی:</span>
              <span className="text-base font-bold text-amber-400">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            {/* Quick Contact Form */}
            <form onSubmit={handleSubmitRequest} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  نام و نام خانوادگی / نام شرکت
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حاج رضا کریمی"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  شماره تماس جهت هماهنگی
                </label>
                <input
                  type="tel"
                  required
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-left font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  توضیحات و نحوه تحویل (اختیاری)
                </label>
                <textarea
                  rows={2}
                  placeholder="آدرس، زمان ترجیحی بارگیری یا هرگونه نکته تکمیلی..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
              >
                ارسال نهایی درخواست پیش‌فاکتور
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Submission Success Dialog */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                درخواست شما با موفقیت ثبت گردید
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                پیش‌فاکتور برای شما صادر و توسط مسئول انبار در اسرع وقت بررسی خواهد شد.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>کد پیگیری درخواست:</span>
              <span className="font-mono font-bold text-amber-400">
                REQ-8491
              </span>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
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
