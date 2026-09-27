import { z } from 'zod';

export const AdjustStockSchema = z.object({
  deltaQuantity: z.coerce
    .number()
    .int('مقدار تغییر موجودی باید عدد صحیح باشد')
    .refine((val) => val !== 0, {
      message: 'مقدار تغییر موجودی نمی‌تواند صفر باشد',
    }),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT']).default('ADJUSTMENT'),
  reason: z
    .string()
    .trim()
    .min(1, 'ذکر علت تغییر موجودی الزامی است')
    .max(200, 'علت تغییر حداکثر ۲۰۰ کاراکتر است'),
  referenceId: z.string().optional().nullable(),
});

export type AdjustStockInput = z.infer<typeof AdjustStockSchema>;
