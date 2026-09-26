import { z } from 'zod';

export const CreateClientLinkSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(1, 'نام مشتری یا عنوان لینک الزامی است')
    .min(2, 'نام مشتری باید حداقل ۲ کاراکتر باشد')
    .max(150, 'نام مشتری حداکثر می‌تواند ۱۵۰ کاراکتر باشد'),
  phone: z
    .string()
    .trim()
    .max(25, 'شماره تماس حداکثر ۲۵ کاراکتر است')
    .optional()
    .nullable(),
  customToken: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9-_]*$/, 'شناسه لینک فقط می‌تواند شامل حروف انگلیسی، اعداد، خط تیره و زیرخط باشد')
    .max(60, 'شناسه لینک حداکثر ۶۰ کاراکتر است')
    .optional()
    .nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
});

export type CreateClientLinkInput = z.infer<typeof CreateClientLinkSchema>;
