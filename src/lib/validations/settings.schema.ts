import { z } from 'zod';

export const WarehouseSettingsSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, 'نام کسب‌وکار یا انبار الزامی است')
    .min(2, 'نام کسب‌وکار باید حداقل ۲ کاراکتر باشد')
    .max(200, 'نام کسب‌وکار حداکثر ۲۰۰ کاراکتر است'),
  phone: z.string().trim().max(30).optional().default(''),
  mobile: z.string().trim().max(30).optional().default(''),
  address: z.string().trim().max(300).optional().default(''),
  bankAccount: z.string().trim().max(50).optional().default(''),
  taxPercent: z.coerce
    .number()
    .min(0, 'درصد مالیات نمی‌تواند منفی باشد')
    .max(100, 'درصد مالیات نمی‌تواند بیشتر از ۱۰۰ باشد')
    .default(0),
  proformaValidityHours: z.coerce
    .number()
    .int('مدت اعتبار باید عدد صحیح باشد')
    .min(1, 'مدت اعتبار پیش‌فاکتور حداقل ۱ ساعت است')
    .max(720, 'مدت اعتبار حداکثر ۳۰ روز (۷۲۰ ساعت) است')
    .default(48),
  defaultTerms: z.string().trim().max(2000, 'متن شرایط حداکثر ۲۰۰۰ کاراکتر است').default(''),
});

export type WarehouseSettingsInput = z.infer<typeof WarehouseSettingsSchema>;
