/**
 * Converts numeric amounts into Persian written words.
 * Standard requirement for official Iranian invoices and accounting receipts.
 */

const ONES = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
const TEENS = [
  'ده',
  'یازده',
  'دوازده',
  'سیزده',
  'چهارده',
  'پانزده',
  'شانزده',
  'هفده',
  'هجده',
  'نوزده',
];
const TENS = [
  '',
  '',
  'بیست',
  'سی',
  'چهل',
  'پنجاه',
  'شصت',
  'هفتاد',
  'هشتاد',
  'نود',
];
const HUNDREDS = [
  '',
  'یکصد',
  'دویست',
  'سیصد',
  'چهارصد',
  'پانصد',
  'ششصد',
  'هفتصد',
  'هشتصد',
  'نهصد',
];
const SCALES = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];

function convertChunk(num: number): string[] {
  const parts: string[] = [];
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;
  const tens = Math.floor(remainder / 10);
  const ones = remainder % 10;

  if (hundreds > 0) {
    parts.push(HUNDREDS[hundreds]);
  }

  if (remainder >= 10 && remainder < 20) {
    parts.push(TEENS[remainder - 10]);
  } else {
    if (tens > 1) {
      parts.push(TENS[tens]);
    }
    if (ones > 0) {
      parts.push(ONES[ones]);
    }
  }

  return parts;
}

export function numberToWordsPersian(input: number | string): string {
  const num = typeof input === 'string' ? Math.floor(parseFloat(input)) : Math.floor(input);

  if (isNaN(num) || num === 0) {
    return 'صفر';
  }

  if (num < 0) {
    return 'منفی ' + numberToWordsPersian(Math.abs(num));
  }

  const chunks: number[] = [];
  let temp = num;

  while (temp > 0) {
    chunks.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  const resultParts: string[] = [];

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i];
    if (chunk === 0) continue;

    const chunkWords = convertChunk(chunk);
    if (chunkWords.length > 0) {
      const scale = SCALES[i];
      const chunkStr = chunkWords.join(' و ');
      if (scale) {
        resultParts.push(`${chunkStr} ${scale}`);
      } else {
        resultParts.push(chunkStr);
      }
    }
  }

  return resultParts.join(' و ');
}

export function formatPersianCurrencyWords(amount: number | string): string {
  const words = numberToWordsPersian(amount);
  return `${words} تومان`;
}
