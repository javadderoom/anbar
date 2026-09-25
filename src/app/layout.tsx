import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';

const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazir',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'انبار | سامانه انبارداری و پیش‌فاکتور',
  description: 'سیستم یکپارچه مدیریت انبار، اشتراک کاتالوگ و صدور پیش‌فاکتور',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500/20 selection:text-amber-300">
        {children}
      </body>
    </html>
  );
}
