import { describe, it, expect } from 'vitest';
import * as XLSX from 'xlsx';
import { parseProductsFromExcelFile } from '@/lib/excel';

describe('Excel Parser for Warehouse Products', () => {
  it('parses Excel file with Persian headers correctly', async () => {
    const data = [
      {
        'کد کالا (SKU)': 'ANB-101',
        'نام کالا': 'لوله مانیسمان رده ۴۰',
        'دسته‌بندی': 'لوله و اتصالات',
        'واحد سنجش': 'شاخه',
        'قیمت واحد (تومان)': 2850000,
        'موجودی انبار': 45,
        'حداقل موجودی هشدار': 10,
      },
      {
        'کد کالا (SKU)': 'ANB-102',
        'نام کالا': 'فلنج گلودار جوشی',
        'دسته‌بندی': 'فلنج',
        'واحد سنجش': 'عدد',
        'قیمت واحد (تومان)': 750000,
        'موجودی انبار': 120,
        'حداقل موجودی هشدار': 15,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const u8 = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const file = new File([u8], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const parsed = await parseProductsFromExcelFile(file);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].sku).toBe('ANB-101');
    expect(parsed[0].name).toBe('لوله مانیسمان رده ۴۰');
    expect(parsed[0].unitPrice).toBe(2850000);
    expect(parsed[0].stockQuantity).toBe(45);
    expect(parsed[0].unit).toBe('شاخه');

    expect(parsed[1].sku).toBe('ANB-102');
    expect(parsed[1].unitPrice).toBe(750000);
  });

  it('parses Excel file with English headers and fallback values', async () => {
    const data = [
      {
        sku: 'EN-501',
        name: 'Ball Valve 2 inch',
        price: '1500000',
        stock: '30',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const u8 = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const file = new File([u8], 'test-en.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const parsed = await parseProductsFromExcelFile(file);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].sku).toBe('EN-501');
    expect(parsed[0].name).toBe('Ball Valve 2 inch');
    expect(parsed[0].unitPrice).toBe(1500000);
    expect(parsed[0].stockQuantity).toBe(30);
    expect(parsed[0].unit).toBe('عدد'); // Default fallback unit
    expect(parsed[0].minStockAlert).toBe(5); // Default fallback alert
  });

  it('parses Made-to-Order custom products with lead time from Excel', async () => {
    const data = [
      {
        'کد کالا (SKU)': 'CUST-301',
        'نام کالا': 'مبدل حرارتی سفارشی پوسته و لوله',
        'دسته‌بندی': 'تجهیزات حرارتی',
        'نوع کالا': 'سفارشی',
        'زمان تحویل': '۱۵ روز کاری',
        'واحد سنجش': 'دستگاه',
        'قیمت واحد (تومان)': 45000000,
        'موجودی انبار': 0,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const u8 = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const file = new File([u8], 'test-custom.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const parsed = await parseProductsFromExcelFile(file);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].sku).toBe('CUST-301');
    expect(parsed[0].isCustom).toBe(true);
    expect(parsed[0].leadTimeText).toBe('۱۵ روز کاری');
    expect(parsed[0].stockQuantity).toBe(0);
  });
});
