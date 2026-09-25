import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts English digits to Persian digits
 */
export function toPersianDigits(input: string | number): string {
  const str = String(input);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[+w]);
}

/**
 * Formats a number with comma separators and optional Persian digits
 */
export function formatNumber(
  num: number | string,
  options?: { persianDigits?: boolean }
): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '۰';

  const formatted = new Intl.NumberFormat('en-US').format(n);
  if (options?.persianDigits ?? true) {
    return toPersianDigits(formatted);
  }
  return formatted;
}

/**
 * Formats currency (Toman / Rial) with LRM safety
 */
export function formatCurrency(
  amount: number | string,
  unit: string = 'تومان'
): string {
  const formatted = formatNumber(amount);
  // Prepend \u200E (Left-to-Right Mark) to ensure the number and unit don't reverse in RTL
  return `\u200E${formatted} ${unit}`;
}

/**
 * Formats signed modifiers safely with LRM prefix (+5%, -10%, etc.)
 */
export function formatSignedMetric(
  value: number | string,
  suffix: string = ''
): string {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  const sign = n > 0 ? '+' : '';
  const formatted = formatNumber(Math.abs(n));
  return `\u200E${sign}${n < 0 ? '-' : ''}${formatted}${suffix}`;
}
