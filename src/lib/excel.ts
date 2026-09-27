import * as XLSX from 'xlsx';
import type { Product } from '@/types';

export interface ExcelProductRow {
  sku: string;
  name: string;
  category?: string;
  unit: string;
  unitPrice: number;
  stockQuantity: number;
  minStockAlert?: number;
  isCustom?: boolean;
  leadTimeText?: string;
  specifications?: string;
}

/**
 * Exports products array to an Excel (.xlsx) file downloaded in the browser
 */
export function exportProductsToExcelFile(products: Product[], filename = 'anbar-inventory.xlsx') {
  const rows = products.map((p, index) => ({
    'ردیف': index + 1,
    'کد کالا (SKU)': p.sku,
    'نام کالا': p.name,
    'دسته‌بندی': p.category || '',
    'نوع کالا': p.isCustom ? 'سفارشی' : 'عادی',
    'زمان تحویل': p.leadTimeText || '',
    'واحد سنجش': p.unit,
    'قیمت واحد (تومان)': p.unitPrice,
    'موجودی انبار': p.stockQuantity,
    'حداقل موجودی هشدار': p.minStockAlert,
    'مشخصات فنی': p.specifications ? JSON.stringify(p.specifications) : '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'موجودی انبار');

  XLSX.writeFile(workbook, filename);
}

/**
 * Parses products from an uploaded Excel file
 */
export async function parseProductsFromExcelFile(file: File): Promise<ExcelProductRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet);

  return rawRows.map((row) => {
    // Check both Persian and English header variants
    const sku = String(row['کد کالا (SKU)'] || row['کد کالا'] || row['کد'] || row['sku'] || row['SKU'] || '').trim();
    const name = String(row['نام کالا'] || row['نام'] || row['عنوان'] || row['name'] || row['title'] || '').trim();
    const category = String(row['دسته‌بندی'] || row['دسته'] || row['category'] || '').trim() || undefined;
    const isCustomVal = row['نوع کالا'] || row['سفارشی'] || row['isCustom'];
    const isCustom = String(isCustomVal).toLowerCase().includes('سفارشی') || isCustomVal === true || isCustomVal === 'true';
    const leadTimeText = String(row['زمان تحویل'] || row['مدت تحویل'] || row['leadTime'] || row['leadTimeText'] || '').trim() || undefined;
    const unit = String(row['واحد سنجش'] || row['واحد'] || row['unit'] || 'عدد').trim();
    const unitPrice = parseFloat(row['قیمت واحد (تومان)'] || row['قیمت واحد'] || row['قیمت'] || row['price'] || row['unitPrice'] || 0) || 0;
    const stockQuantity = parseInt(row['موجودی انبار'] || row['موجودی'] || row['تعداد'] || row['stock'] || row['stockQuantity'] || 0, 10) || 0;
    const minStockAlert = parseInt(row['حداقل موجودی هشدار'] || row['حداقل موجودی'] || row['minStock'] || 5, 10) || 5;
    const specifications = row['مشخصات فنی'] || row['مشخصات'] || row['specs'] || undefined;

    return {
      sku: sku || `GEN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name || 'کالای بدون نام',
      category,
      unit,
      unitPrice,
      stockQuantity,
      minStockAlert,
      isCustom,
      leadTimeText,
      specifications: typeof specifications === 'string' ? specifications : JSON.stringify(specifications),
    };
  });
}
