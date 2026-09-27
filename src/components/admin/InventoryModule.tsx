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
  Trash2,
  Loader2,
  RefreshCw,
  History,
  Layers,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { exportProductsToExcelFile, parseProductsFromExcelFile } from '@/lib/excel';
import { notify } from '@/lib/notify';
import { CreateProductSchema } from '@/lib/validations';
import { useCreateProduct, useDeleteProduct, useBulkImportProducts } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { Permission } from '@/lib/permissions';
import StockAdjustModal from './StockAdjustModal';
import StockHistoryModal from './StockHistoryModal';
import type { Product } from '@/types';

interface InventoryModuleProps {
  products: Product[];
  setProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
  isLoading?: boolean;
  onRefresh?: () => Promise<void> | void;
}

export default function InventoryModule({
  products,
  setProducts,
  isLoading = false,
  onRefresh,
}: InventoryModuleProps) {
  const { can } = useAuth();
  const canAddProduct = can(Permission.ADD_PRODUCT);
  const canDeleteProduct = can(Permission.DELETE_PRODUCT);
  const canEditStock = can(Permission.EDIT_STOCK);
  const canViewInventory = can(Permission.VIEW_INVENTORY);

  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low_stock' | 'out_of_stock'>('all');
  const [selectedProductForAdjust, setSelectedProductForAdjust] = useState<Product | null>(null);
  const [selectedProductForHistory, setSelectedProductForHistory] = useState<Product | null>(null);

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TanStack Query mutations
  const createProductMutation = useCreateProduct();
  const deleteProductMutation = useDeleteProduct();
  const bulkImportMutation = useBulkImportProducts();

  const isSubmitting = createProductMutation.isPending;
  const isImporting = bulkImportMutation.isPending;

  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    category: '',
    unit: 'عدد',
    unitPrice: 0,
    stockQuantity: 0,
    minStockAlert: 5,
  });

  // Filtered products by search and stock threshold
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (stockFilter === 'out_of_stock') {
      return p.stockQuantity === 0;
    }
    if (stockFilter === 'low_stock') {
      return p.stockQuantity <= p.minStockAlert;
    }
    return true;
  });

  const lowStockTotal = products.filter((p) => p.stockQuantity <= p.minStockAlert).length;
  const outOfStockTotal = products.filter((p) => p.stockQuantity === 0).length;

  // Excel Export Handler
  const handleExportExcel = () => {
    if (products.length === 0) {
      notify.warning('کالایی برای صدور فایل اکسل وجود ندارد');
      return;
    }
    exportProductsToExcelFile(products);
    notify.success('فایل اکسل موجودی کالاها با موفقیت دانلود شد');
  };

  // Excel Import Handler
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedRows = await parseProductsFromExcelFile(file);
      const res = await bulkImportMutation.mutateAsync(parsedRows);

      if (onRefresh) {
        await onRefresh();
      }

      notify.success(res.message || `تعداد ${parsedRows.length} کالا در دیتابیس ثبت شد`);
    } catch (err: any) {
      notify.error(err.message || 'خطا در بارگذاری فایل اکسل');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add Product Submit (Writes directly to Neon DB with Zod validation)
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = CreateProductSchema.safeParse(newProduct);
    if (!validation.success) {
      setAddError(validation.error.issues[0].message);
      return;
    }

    try {
      setAddError(null);
      const created = await createProductMutation.mutateAsync(validation.data);

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

      if (onRefresh) {
        await onRefresh();
      }

      notify.success(`کالای «${created.name}» با موفقیت در دیتابیس ثبت شد`);
    } catch (err: any) {
      setAddError(err.message || 'خطای برقراری ارتباط با سرور');
    }
  };

  // Delete Product Handler with custom confirm
  const handleDeleteProduct = async (id: string, name: string) => {
    const confirmed = await notify.confirm({
      title: 'حذف کالا از انبار',
      message: `آیا از حذف کالای «${name}» از سامانه اطمینان دارید؟`,
      confirmText: 'حذف کالا',
      isDestructive: true,
    });

    if (!confirmed) return;

    try {
      await deleteProductMutation.mutateAsync(id);
      if (onRefresh) {
        await onRefresh();
      }
      notify.success(`کالای «${name}» حذف گردید`);
    } catch (err: any) {
      notify.error(err.message || 'خطا در حذف کالا از دیتابیس');
    }
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
          {canAddProduct && (
            <>
              <button
                onClick={() => {
                  setAddError(null);
                  setIsAddProductOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت کالای جدید</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs active:scale-95 transition-all disabled:opacity-50"
              >
                {isImporting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                )}
                <span>ورود از اکسل (Excel)</span>
              </button>
            </>
          )}

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>خروجی اکسل</span>
          </button>

          {onRefresh && (
            <button
              onClick={() => onRefresh()}
              disabled={isLoading}
              title="بروزرسانی داده‌ها از دیتابیس"
              className="p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-500' : ''}`} />
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="جستجوی کد، نام یا دسته..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Stock Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setStockFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            stockFilter === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span>همه کالاها</span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
            {formatNumber(products.length)}
          </span>
        </button>

        <button
          onClick={() => setStockFilter('low_stock')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            stockFilter === 'low_stock'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span>هشدار کسری موجودی</span>
          {lowStockTotal > 0 && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono font-bold">
              {formatNumber(lowStockTotal)}
            </span>
          )}
        </button>

        <button
          onClick={() => setStockFilter('out_of_stock')}
          className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            stockFilter === 'out_of_stock'
              ? 'bg-rose-500 text-white font-bold shadow-sm shadow-rose-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <span>اتمام موجودی</span>
          {outOfStockTotal > 0 && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-rose-500/20 text-rose-700 dark:text-rose-300 font-mono font-bold">
              {formatNumber(outOfStockTotal)}
            </span>
          )}
        </button>
      </div>

      {/* Loading Skeleton Indicator */}
      {isLoading && products.length === 0 && (
        <div className="p-12 text-center text-slate-400 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          <span>در حال بارگذاری کالاها از دیتابیس Neon...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProducts.length === 0 && (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
          <Boxes className="w-8 h-8 text-slate-400 mx-auto opacity-60" />
          <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
            {searchQuery ? 'کالایی با این مشخصات یافت نشد' : 'هنوز کالایی در انبار ثبت نشده است'}
          </p>
          <p className="text-[11px] text-slate-500">
            {searchQuery
              ? 'عبارت جستجو را تغییر دهید یا فیلترها را پاک کنید.'
              : 'برای شروع، دکمه «ثبت کالای جدید» را بزنید یا فایل اکسل موجودی را وارد نمایید.'}
          </p>
        </div>
      )}

      {/* Mobile View: Product Cards */}
      <div className="md:hidden space-y-3">
        {filteredProducts.map((p) => {
          const isOutOfStock = p.stockQuantity === 0;
          const isLowStock = !isOutOfStock && p.stockQuantity <= p.minStockAlert;

          return (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 space-y-3 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" dir="ltr">
                    {p.sku}
                  </span>
                  {p.category && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400">
                      {p.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {isOutOfStock ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>اتمام موجودی</span>
                    </span>
                  ) : isLowStock ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>کسری موجودی</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      موجودی کافی
                    </span>
                  )}

                  <button
                    onClick={() => setSelectedProductForHistory(p)}
                    className="p-1 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                    title="تاریخچه گردش انبار"
                  >
                    <History className="w-3.5 h-3.5" />
                  </button>

                  {canEditStock && (
                    <button
                      onClick={() => setSelectedProductForAdjust(p)}
                      className="p-1 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                      title="اصلاح و ورود/خروج موجودی"
                    >
                      <Layers className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {canDeleteProduct && (
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="حذف کالا"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {p.name}
              </h3>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] block">قیمت واحد:</span>
                  <strong className="text-amber-600 dark:text-amber-400 font-bold block">
                    {formatCurrency(p.unitPrice)}
                  </strong>
                </div>

                <div className="space-y-0.5 text-left" dir="rtl">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] block">موجودی انبار:</span>
                  <span
                    className={`inline-flex items-center gap-1 font-bold ${
                      isOutOfStock
                        ? 'text-rose-600 dark:text-rose-400'
                        : isLowStock
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
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

      {/* Desktop View: Full Table */}
      {filteredProducts.length > 0 && (
        <div className="hidden md:block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">کد کالا</th>
                  <th className="p-3.5">نام کالا</th>
                  <th className="p-3.5">دسته</th>
                  <th className="p-3.5">واحد</th>
                  <th className="p-3.5">قیمت واحد</th>
                  <th className="p-3.5">موجودی انبار</th>
                  <th className="p-3.5 text-center">وضعیت</th>
                  <th className="p-3.5 text-center w-20">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredProducts.map((p) => {
                  const isOutOfStock = p.stockQuantity === 0;
                  const isLowStock = !isOutOfStock && p.stockQuantity <= p.minStockAlert;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300 font-medium" dir="ltr">
                        {p.sku}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {p.name}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">{p.category}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">{p.unit}</td>
                      <td className="p-3.5 font-bold text-amber-600 dark:text-amber-400">
                        {formatCurrency(p.unitPrice)}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold ${
                              isOutOfStock
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                : isLowStock
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {formatNumber(p.stockQuantity)} {p.unit}
                          </span>
                          {canEditStock && (
                            <button
                              onClick={() => setSelectedProductForAdjust(p)}
                              title="ورود، خروج یا انبارگردانی"
                              className="p-1 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                            >
                              <Layers className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        {isOutOfStock ? (
                          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center justify-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>اتمام موجودی</span>
                          </span>
                        ) : isLowStock ? (
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center justify-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>کسری موجودی</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            کافی
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedProductForHistory(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="تاریخچه گردش انبار"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          {canDeleteProduct && (
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="حذف کالا"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-amber-500" />
                <span>ثبت کالای جدید در انبار</span>
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {addError}
              </div>
            )}

            <form onSubmit={handleAddProductSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">کد کالا (SKU)</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ANB-106"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">نام کالا</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: زانو ۹۰ درجه جوشی"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">دسته‌بندی</label>
                  <input
                    type="text"
                    placeholder="مثال: اتصالات"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">واحد سنجش</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: عدد / شاخه"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">قیمت واحد (تومان)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="۰"
                    value={newProduct.unitPrice || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-mono"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">موجودی انبار</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="۰"
                    value={newProduct.stockQuantity || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">حداقل موجودی هشدار</label>
                <input
                  type="number"
                  min={1}
                  placeholder="۵"
                  value={newProduct.minStockAlert || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, minStockAlert: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>در حال ذخیره...</span>
                    </>
                  ) : (
                    <span>ذخیره کالا</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal (In / Out / Direct Count) */}
      {selectedProductForAdjust && (
        <StockAdjustModal
          product={selectedProductForAdjust}
          isOpen={!!selectedProductForAdjust}
          onClose={() => setSelectedProductForAdjust(null)}
          onSuccess={async () => {
            if (onRefresh) {
              await onRefresh();
            }
          }}
        />
      )}

      {/* Stock Movement History Ledger Modal */}
      {selectedProductForHistory && (
        <StockHistoryModal
          product={selectedProductForHistory}
          isOpen={!!selectedProductForHistory}
          onClose={() => setSelectedProductForHistory(null)}
        />
      )}
    </div>
  );
}
