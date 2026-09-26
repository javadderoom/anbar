'use client';

import React, { useState, useRef } from 'react';
import {
  Boxes,
  Plus,
  Search,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  X,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { exportProductsToExcelFile, parseProductsFromExcelFile } from '@/lib/excel';
import type { Product } from '@/types';

interface InventoryModuleProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function InventoryModule({
  products,
  setProducts,
}: InventoryModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    category: '',
    unit: 'عدد',
    unitPrice: 0,
    stockQuantity: 0,
    minStockAlert: 5,
  });

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
    } catch {
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

  return (
    <div className="space-y-4">
      {/* Hidden file input for Excel upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportExcel}
        accept=".xlsx, .xls, .csv"
        className="hidden"
      />

      {/* Action Toolbar */}
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
    </div>
  );
}
