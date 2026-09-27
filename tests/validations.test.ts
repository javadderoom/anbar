import { describe, it, expect } from 'vitest';
import {
  CreateProductSchema,
  AdjustStockSchema,
  CreateOrderRequestSchema,
  WarehouseSettingsSchema,
} from '@/lib/validations';

describe('Zod Schema Validations & Integrity', () => {
  describe('CreateProductSchema', () => {
    it('accepts valid product input', () => {
      const result = CreateProductSchema.safeParse({
        sku: 'ANB-101',
        name: 'اتصالات جوشی ۹۰ درجه',
        category: 'اتصالات',
        unit: 'عدد',
        unitPrice: 150000,
        stockQuantity: 25,
        minStockAlert: 5,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sku).toBe('ANB-101');
        expect(result.data.isCustom).toBe(false);
      }
    });

    it('accepts made-to-order custom product with lead time and 0 physical stock', () => {
      const result = CreateProductSchema.safeParse({
        sku: 'CUST-202',
        name: 'شیر برقی سفارشی ضد انفجار',
        category: 'سفارشی',
        unit: 'دستگاه',
        unitPrice: 12000000,
        stockQuantity: 0,
        minStockAlert: 1,
        isCustom: true,
        leadTimeText: '۷ تا ۱۰ روز کاری',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isCustom).toBe(true);
        expect(result.data.leadTimeText).toBe('۷ تا ۱۰ روز کاری');
        expect(result.data.stockQuantity).toBe(0);
      }
    });

    it('rejects negative unit price or stock', () => {
      const result = CreateProductSchema.safeParse({
        sku: 'ANB-102',
        name: 'شیر فلکه',
        unitPrice: -500,
        stockQuantity: -1,
      });

      expect(result.success).toBe(false);
    });

    it('rejects empty name or sku', () => {
      const result = CreateProductSchema.safeParse({
        sku: '   ',
        name: '',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('AdjustStockSchema', () => {
    it('validates stock IN and OUT adjustments', () => {
      const inResult = AdjustStockSchema.safeParse({
        deltaQuantity: 10,
        type: 'IN',
        reason: 'ورود محموله جدید',
      });
      expect(inResult.success).toBe(true);

      const outResult = AdjustStockSchema.safeParse({
        deltaQuantity: -5,
        type: 'OUT',
        reason: 'ضایعات',
      });
      expect(outResult.success).toBe(true);
    });

    it('rejects zero deltaQuantity', () => {
      const result = AdjustStockSchema.safeParse({
        deltaQuantity: 0,
        type: 'ADJUSTMENT',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('CreateOrderRequestSchema & Honeypot', () => {
    it('accepts valid order submission', () => {
      const result = CreateOrderRequestSchema.safeParse({
        clientName: 'حاج رضا کریمی',
        clientPhone: '09123456789',
        items: [
          {
            productId: 'prod-1',
            name: 'لوله صنعتی',
            quantity: 3,
            unitPrice: 450000,
          },
        ],
      });

      expect(result.success).toBe(true);
    });

    it('rejects order with zero items', () => {
      const result = CreateOrderRequestSchema.safeParse({
        clientName: 'حاج رضا کریمی',
        clientPhone: '09123456789',
        items: [],
      });

      expect(result.success).toBe(false);
    });

    it('captures honeypot bot trap field', () => {
      const result = CreateOrderRequestSchema.safeParse({
        clientName: 'Bot User',
        clientPhone: '09120000000',
        hp_company: 'I am a spam bot',
        items: [
          {
            productId: 'prod-1',
            name: 'لوله صنعتی',
            quantity: 1,
            unitPrice: 1000,
          },
        ],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.hp_company).toBe('I am a spam bot');
      }
    });
  });

  describe('WarehouseSettingsSchema', () => {
    it('validates settings with Iranian tax identity attributes', () => {
      const result = WarehouseSettingsSchema.safeParse({
        businessName: 'بازرگانی انبار مرکزی',
        nationalId: '10103000000',
        economicCode: '411100000000',
        postalCode: '1151000000',
        taxPercent: 10,
        proformaValidityHours: 72,
      });

      expect(result.success).toBe(true);
    });
  });
});
