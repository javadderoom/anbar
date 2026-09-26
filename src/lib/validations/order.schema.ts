import { z } from 'zod';

export const OrderItemSchema = z.object({
  productId: z.string().min(1, 'شناسه کالا الزامی است'),
  name: z.string().min(1, 'عنوان کالا الزامی است'),
  sku: z.string().optional().nullable(),
  unit: z.string().default('عدد'),
  unitPrice: z.coerce.number().nonnegative().default(0),
  quantity: z.coerce
    .number()
    .int('تعداد باید عدد صحیح باشد')
    .min(1, 'تعداد اقلام انتخابی باید حداقل ۱ باشد'),
});

export const CreateOrderRequestSchema = z.object({
  token: z.string().optional().default('demo'),
  clientName: z
    .string()
    .trim()
    .min(1, 'نام خریدار یا مشتری الزامی است')
    .min(2, 'نام مشتری باید حداقل ۲ کاراکتر باشد')
    .max(150, 'نام مشتری حداکثر می‌تواند ۱۵۰ کاراکتر باشد'),
  clientPhone: z
    .string()
    .trim()
    .min(1, 'شماره تماس جهت هماهنگی الزامی است')
    .min(8, 'شماره تماس باید حداقل ۸ رقم باشد')
    .max(25, 'شماره تماس نامعتبر است'),
  notes: z.string().trim().max(1000, 'توضیحات حداکثر ۱۰۰۰ کاراکتر است').optional().nullable(),
  items: z
    .array(OrderItemSchema)
    .min(1, 'حداقل یک قلم کالا باید برای ثبت پیش‌فاکتور انتخاب شود'),
});

export const ConvertOrderRequestSchema = z.object({
  deductStock: z.boolean().default(true),
  invoiceType: z.enum(['PROFORMA', 'SALES']).default('SALES'),
});

export type OrderItemInput = z.infer<typeof OrderItemSchema>;
export type CreateOrderRequestInput = z.infer<typeof CreateOrderRequestSchema>;
export type ConvertOrderRequestInput = z.infer<typeof ConvertOrderRequestSchema>;
