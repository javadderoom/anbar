import { describe, it, expect } from 'vitest';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { numberToWordsPersian, formatPersianCurrencyWords } from '@/lib/number-to-words';

describe('Financial & Currency Calculations', () => {
  it('formats numbers into Persian digits', () => {
    const formatted = formatNumber(1250);
    expect(formatted).toBe('۱,۲۵۰');
  });

  it('formats zero correctly', () => {
    expect(formatNumber(0)).toBe('۰');
  });

  it('formats currency with تومان suffix and LTR mark', () => {
    const currency = formatCurrency(250000);
    expect(currency).toContain('۲۵۰,۰۰۰');
    expect(currency).toContain('تومان');
    expect(currency).toContain('\u200e');
  });

  it('converts small numbers into Persian words', () => {
    expect(numberToWordsPersian(0)).toBe('صفر');
    expect(numberToWordsPersian(5)).toBe('پنج');
    expect(numberToWordsPersian(18)).toBe('هجده');
    expect(numberToWordsPersian(85)).toBe('هشتاد و پنج');
  });

  it('converts hundreds and thousands into Persian words', () => {
    expect(numberToWordsPersian(105)).toBe('یکصد و پنج');
    expect(numberToWordsPersian(25000)).toBe('بیست و پنج هزار');
    expect(numberToWordsPersian(1250000)).toBe('یک میلیون و دویست و پنجاه هزار');
  });

  it('appends currency suffix in formatPersianCurrencyWords', () => {
    expect(formatPersianCurrencyWords(1250000)).toBe(
      'یک میلیون و دویست و پنجاه هزار تومان'
    );
  });

  it('calculates invoice net payable with discount and VAT correctly', () => {
    const subtotal = 10000000; // 10,000,000 Tomans
    const discount = 500000;   // 500,000 Tomans discount
    const vatRate = 10;        // 10% VAT

    const taxableAmount = Math.max(0, subtotal - discount);
    const vatAmount = Math.round((taxableAmount * vatRate) / 100);
    const netPayable = taxableAmount + vatAmount;

    expect(taxableAmount).toBe(9500000);
    expect(vatAmount).toBe(950000);
    expect(netPayable).toBe(10450000);
    expect(formatPersianCurrencyWords(netPayable)).toBe(
      'ده میلیون و چهارصد و پنجاه هزار تومان'
    );
  });
});
