import Link from 'next/link';
import {
  Boxes,
  Link2,
  FileSpreadsheet,
  FileText,
  Smartphone,
  ShieldCheck,
  ArrowLeft,
  ChevronLeft,
  Warehouse,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background radial highlights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 right-1/2 translate-x-1/2 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Warehouse className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">
                انبار
              </span>
              <span className="text-[10px] text-amber-400 font-medium tracking-wide uppercase block -mt-1">
                Anbar B2B Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold transition-all shadow-md shadow-amber-500/20 active:scale-95"
            >
              <span>ورود به پنل مدیریت</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>سامانه هوشمند انبارداری، لینک‌های اختصاصی و پیش‌فاکتور</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            مدیریت دقیق موجودی و کاتالوگ‌های{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
              اختصاصی بدون ثبت‌نام
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            پلتفرم اختصاصی جهت مدیریت کالاها، ارسال لینک اختصاصی برای خریداران، ثبت سریع سفارش‌ها و صدور پیش‌فاکتور و فاکتور رسمی با خروجی‌های استاندارد اکسل و PDF.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/admin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/25 transition-all active:scale-98"
            >
              <span>ورود به پنل ادمین انبار</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/c/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 font-semibold transition-all hover:border-slate-700 active:scale-98"
            >
              <span>مشاهده نمونه لینک مشتری (موبایل)</span>
              <Smartphone className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-amber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <Boxes className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              مدیریت انبار و کالاها
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              ثبت مشخصات فنی، واحد سنجش، تعداد موجودی، قیمت پایه و هشدار اتمام کالا به صورت لحظه‌ای.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-amber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition-transform">
              <Link2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              لینک اختصاصی بدون ثبت‌نام
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              تولید لینک یکتای کاتالوگ برای هر مشتری بدون نیاز به ساخت حساب یا رمز عبور؛ سفارش‌ها مستقیماً با نام همان مشتری ثبت می‌شوند.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-amber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              پیش‌فاکتور و فاکتور فروش
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              صدور خودکار پیش‌فاکتور از روی درخواست مشتری و امکان تبدیل تک‌کلیکه به فاکتور قطعی با کسر خودکار از موجودی انبار.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-amber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              طراحی اختصاصی موبایل‌فرست
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              تجربه روان با دکمه‌های بزرگ لمسی، منوی چسبان سبد خرید، کارت‌های مشخصات بازشونده و عملکرد سریع روی انواع موبایل.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-amber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              خروجی و ورودی اکسل (Excel)
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              امکان آپلود کالاها و مشخصات با فایل اکسل و دریافت گزارش‌های وضعیت موجودی و فاکتورها در قالب اکسل استاندارد.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm hover:border-amber-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              خروجی PDF رسمی و شکیل
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              صدور فایل‌های PDF استاندارد با چینش دقیق راست‌به‌چپ (RTL)، تاریخ شمسی، جدول اقلام و جایگاه مهر و امضا برای چاپ یا ارسال.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        <p>سیستم اختصاصی انبارداری و پیش‌فاکتور — آماده استقرار روی Vercel و Neon</p>
      </footer>
    </div>
  );
}
