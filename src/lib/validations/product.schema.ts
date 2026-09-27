import { z } from 'zod';

export const CreateProductSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, 'کد کالا (SKU) الزامی است')
    .min(2, 'کد کالا باید حداقل ۲ کاراکتر باشد')
    .max(50, 'کد کالا حداکثر می‌تواند ۵۰ کاراکتر باشد'),
  name: z
    .string()
    .trim()
    .min(1, 'نام کالا الزامی است')
    .min(2, 'نام کالا باید حداقل ۲ کاراکتر باشد')
    .max(200, 'نام کالا حداکثر می‌تواند ۲۰۰ کاراکتر باشد'),
  category: z
    .string()
    .trim()
    .max(100, 'نام دسته‌بندی حداکثر ۱۰۰ کاراکتر است')
    .optional()
    .default('دسته‌بندی نشده'),
  unit: z
    .string()
    .trim()
    .min(1, 'واحد سنجش کالا الزامی است')
    .max(50, 'واحد سنجش حداکثر ۵۰ کاراکتر است')
    .default('عدد'),
  unitPrice: z.coerce
    .number()
    .nonnegative('قیمت واحد نمی‌تواند منفی باشد')
    .default(0),
  stockQuantity: z.coerce
    .number()
    .int('موجودی انبار باید عدد صحیح باشد')
    .nonnegative('موجودی انبار نمی‌تواند منفی باشد')
    .default(0),
  minStockAlert: z.coerce
    .number()
    .int('حداقل موجودی هشدار باید عدد صحیح باشد')
    .min(1, 'حداقل موجودی هشدار باید حداقل ۱ باشد')
    .default(5),
  description: z.string().trim().max(1000).optional().nullable(),
  specifications: z.record(z.string(), z.union([z.string(), z.number()])).optional().nullable(),
  isCustom: z.boolean().optional().default(false),
  leadTimeText: z.string().trim().max(150, 'متن مدت تحویل حداکثر ۱۵۰ کاراکتر است').optional().nullable(),
});

export const UpdateProductSchema = CreateProductSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const BulkImportRowSchema = z.object({
  sku: z.union([z.string(), z.number()]).transform((val) => val.toString().trim()),
  name: z.string().trim().min(1, 'نام کالا در فایل اکسل الزامی است'),
  category: z.string().trim().optional().default('دسته‌بندی نشده'),
  unit: z.string().trim().optional().default('عدد'),
  unitPrice: z.coerce.number().nonnegative().default(0),
  stockQuantity: z.coerce.number().int().nonnegative().default(0),
  minStockAlert: z.coerce.number().int().min(1).default(5),
  isCustom: z.boolean().optional().default(false),
  leadTimeText: z.string().trim().max(150).optional().nullable(),
});

export const BulkImportSchema = z.object({
  items: z.array(BulkImportRowSchema).min(1, 'حداقل یک سطر معتبر کالا در فایل اکسل باید وجود داشته باشد'),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type BulkImportInput = z.infer<typeof BulkImportSchema>;
