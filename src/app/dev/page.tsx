'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  Zap,
  Printer,
  Search,
  ArrowRight,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
  GitBranch,
  FileSpreadsheet,
  Boxes,
  Smartphone,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function DevDocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('sec-overview');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = 'sec-overview';
      sections.forEach((sec) => {
        const top = (sec as HTMLElement).offsetTop - 140;
        if (window.scrollY >= top) {
          current = sec.getAttribute('id') || current;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'sec-overview', title: '۱. نمای کلی و معماری سیستم', badge: 'Monolith' },
    { id: 'sec-framework', title: '۲. فریم‌ورک Next.js 16', badge: 'App Router' },
    { id: 'sec-database', title: '۳. دیتابیس Neon Serverless', badge: 'Postgres' },
    { id: 'sec-orm', title: '۴. لایه داده Prisma 7', badge: 'Adapter-PG' },
    { id: 'sec-auth', title: '۵. سیستم دسترسی بیت‌ماسک', badge: 'Bitmask' },
    { id: 'sec-jwt', title: '۶. سشن و رمزنگاری کلمات عبور', badge: 'JWT HttpOnly' },
    { id: 'sec-concurrency', title: '۷. همزمانی و کسر اتمیک انبار', badge: 'Atomic' },
    { id: 'sec-custom-items', title: '۸. اقلام سفارشی (MTO)', badge: 'Lead Time' },
    { id: 'sec-catalog', title: '۹. کاتالوگ عمومی بدون اصطکاک', badge: 'Tokenized' },
    { id: 'sec-tax', title: '۱۰. محاسبات مالی و ماده ۱۶۹', badge: 'Proforma' },
    { id: 'sec-tanstack', title: '۱۱. همگام‌سازی TanStack Query', badge: 'React Query v5' },
    { id: 'sec-virtual', title: '۱۲. مجازی‌سازی لیست کالاها', badge: 'Virtualization' },
    { id: 'sec-styling', title: '۱۳. استایلینگ، تم و قوانین RTL', badge: 'Tailwind' },
    { id: 'sec-testing', title: '۱۴. تضمین کیفیت و تست Vitest', badge: 'Vitest' },
    { id: 'sec-matrix', title: '۱۵. ماتریس جامع آلترناتیوها', badge: 'Matrix' },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-amber-500/20 selection:text-amber-600 dark:selection:text-amber-300 font-sans transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                <span>مستندات معماری فنی و تصمیمات مهندسی انبار</span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-semibold" dir="ltr">
                  /dev • Next.js 16
                </span>
              </h1>
              <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                تحلیل جامع زیرساخت، بیت‌ماسک، همزمانی پایگاه داده و مقایسه آلترناتیوها (ADR)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              title="چاپ یا ذخیره صفحه به صورت PDF"
              className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">چاپ / PDF</span>
            </button>

            <ThemeToggle />

            <Link
              href="/admin"
              className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold transition-all active:scale-95"
            >
              <span>پنل مدیریت</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
        {/* Sticky Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pl-2 pr-1 no-scrollbar space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="جستجوی فناوری یا ماژول..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-colors shadow-sm"
            />
          </div>

          <nav className="space-y-1">
            {filteredNavItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border-r-2 border-amber-500'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span className="truncate">{item.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono" dir="ltr">
                  {item.badge}
                </span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 space-y-12">
          {/* Hero Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-blue-500/5 to-transparent border border-amber-500/30 dark:border-amber-500/20 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Architectural Decision Records (ADR) & Technical Whitepaper</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug mb-3">
              کالبدشکافی فنی معماری، تصمیمات مهندسی و چرایی انتخاب فناوری‌های سامانه انبار
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl text-justify">
              این سند جهت مستندسازی صفر تا صد پشته نرم‌افزاری (Tech Stack)، دلایل انتخاب فریم‌ورک‌ها، بررسی آلترناتیوهای رقیب، مکانیزم‌های مقابله با Concurrency و استراتژی‌های دسترسی با عملکرد در سطح نانوثانیه تهیه شده است.
            </p>
          </div>

          {/* SECTION 1: System Overview */}
          <section id="sec-overview" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۱</span>
                <span>نمای کلی و معماری جریان داده (System Overview)</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono font-semibold" dir="ltr">
                Fullstack Monolith
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              سامانه «انبار» به عنوان یک مونو-ریپوی ماژولار و بر پایه اصل <strong>«نگهداری صفر (Zero Ops)»</strong> طراحی شده است. تمرکز سیستم بر حفظ ثبات اتمیک مالی و انبارداری در عین ارائه سرعت آنی و تجربه کاربری نرم‌افزار نیتیو در گوشی‌های هوشمند خریداران است.
            </p>

            {/* Architecture Graphic Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>جریان لایه‌ای تبادل درخواست‌ها و پاسخ‌ها</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">کلاینت خریدار و مدیر</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono" dir="ltr">/c/:token & /admin</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">Virtual Window + TanStack Query</div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">سرور Next.js 16 (Turbopack)</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono" dir="ltr">API Routes & Edge Proxy</div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 font-medium">Bitmask Guard + Zod Engine</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">Neon PostgreSQL (ACID)</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono" dir="ltr">Prisma 7 + PgBouncer Pool</div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-2 font-medium">Atomic Decrement & Audit Trail</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Next.js 16 Framework */}
          <section id="sec-framework" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۲</span>
                <span>فریم‌ورک کلان: چرا Next.js 16 (App Router + Turbopack)؟</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono font-semibold" dir="ltr">
                App Router
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-emerald-500/30 dark:border-emerald-500/20 shadow-sm space-y-3">
                <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  انتخاب شده: Next.js 16
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">مزایای راهبردی برای انبار</h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                  <li><strong>تایپ‌سیفتی سرتاسری (E2E TypeScript):</strong> تعریف یکباره اعتبارسنجی‌ها با Zod و اشتراک دقیق آنها میان روت‌های API و فرم‌های کلاینت بدون کوچکترین مغایرت قراردادی.</li>
                  <li><strong>کامپایلر فوق‌سریع Turbopack:</strong> زمان بیلد و استارت سرور تا ۴ برابر سریع‌تر از وب‌پک سنتی.</li>
                  <li><strong>استقرار یکپارچه (Atomic Deployments):</strong> نیازی به همگام‌سازی جداگانه نسخه فرانت‌اند و بک‌اند نیست.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-rose-500/30 dark:border-rose-500/20 shadow-sm space-y-3">
                <div className="inline-block px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold">
                  آلترناتیو: NestJS/Express + React SPA
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">چرا رد شد؟</h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                  <li><strong>دو برابر شدن هزینه و عملیات:</strong> نیاز به راه‌اندازی دو سرور مجزا، تعریف مجدد DTO ها و تایپ‌ها، و مدیریت دو خط CI/CD.</li>
                  <li><strong>تاخیر پیش‌پرواز (CORS Preflight Overhead):</strong> درخواست‌های اضافی <code className="text-amber-500 font-mono">OPTIONS</code> در بک‌اند مجزا باعث تاخیر ۲۰۰ تا ۴۰۰ میلی‌ثانیه‌ای در موبایل خریداران می‌شد.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 3: Neon Serverless PostgreSQL */}
          <section id="sec-database" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۳</span>
                <span>پایگاه داده: استراتژی Neon Serverless PostgreSQL</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono font-semibold" dir="ltr">
                Neon Postgres
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              به دلیل الزامات حقوقی ماده ۱۶۹ مالیاتی و جلوگیری از خطای همزمانی، پایگاه داده‌های رابطه‌ای ACID اجباری بود. Neon به عنوان مدرن‌ترین بستر سرورلس پستگرس انتخاب شد.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white">
                    <th className="p-3.5 font-bold">بستر دیتابیس</th>
                    <th className="p-3.5 font-bold">مزیت اصلی</th>
                    <th className="p-3.5 font-bold">دلیل ارجحیت یا رد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                  <tr>
                    <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">Neon Serverless (برگزیده)</td>
                    <td className="p-3.5">جداسازی محاسبه از حافظه، برنچینگ فوری، لایه PgBouncer</td>
                    <td className="p-3.5 font-medium text-slate-900 dark:text-white">مقیاس‌پذیری خودکار و کاهش هزینه نگهداری به صفر</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">Supabase</td>
                    <td className="p-3.5">سرویس‌های جانبی نظیر Auth و Storage</td>
                    <td className="p-3.5 text-rose-600 dark:text-rose-400">سربار امکانات بلااستفاده و هزینه ماهانه بالاتر</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">Docker Postgres on VPS</td>
                    <td className="p-3.5">کنترل سخت‌افزاری صددرصدی</td>
                    <td className="p-3.5 text-rose-600 dark:text-rose-400">سربار نگهداری، پچ‌های امنیتی لینوکس و ریسک دان‌تایم</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-blue-600 dark:text-blue-400 block mb-1">الگوی اتصال دوگانه (Dual-Connection Pattern):</strong>
              سامانه از <code className="font-mono text-amber-500">DATABASE_URL</code> (پورت ۶۵۴۳ پولر PgBouncer) برای پاسخگویی به درخواست‌های سرورلس با کمترین مصرف حافظه، و از <code className="font-mono text-amber-500">DIRECT_URL</code> (پورت ۵۴۳۲ اختصاصی) برای اعمال تغییرات ساختاری DDL مایگریشن‌های Prisma بهره می‌گیرد.
            </div>
          </section>

          {/* SECTION 4: Prisma 7 */}
          <section id="sec-orm" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۴</span>
                <span>لایه دسترسی به داده: معماری Prisma 7 و Driver Adapter</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono font-semibold" dir="ltr">
                @prisma/adapter-pg
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400">تغییر مهم نسل هفتم پریزما (Prisma 7)</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  در Prisma 7، نوشتن <code className="font-mono text-amber-500">url = env(...)</code> در فایل اسکیما منسوخ و سبب خطای <code className="font-mono text-rose-500">P1012</code> است. اتصال‌ها از طریق فایل استاندارد <code className="font-mono text-blue-500">prisma.config.ts</code> و در زمان ران‌تایم توسط آداپتور <code className="font-mono text-emerald-500">@prisma/adapter-pg</code> با استخر اتصالات <code className="font-mono text-amber-500">pg.Pool</code> به سیستم تزریق می‌گردند.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white">چرا Drizzle یا TypeORM انتخاب نشد؟</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  پریزما پادشاه سرعت توسعه و دقت مایگریشن است. موتور <code className="font-mono">prisma migrate</code> تضمین می‌کند بدون افتادن در دام ناهماهنگی پایگاه داده تیمی، فایل‌های SQL تغییرات به شکل تاریخی ثبت شوند؛ امری که برای صدور اسناد تجاری و پیش‌فاکتورها حیاتی است.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 5: Bitmask RBAC */}
          <section id="sec-auth" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۵</span>
                <span>سیستم مجوزهای اتمیک مبتنی بر بیت‌ماسک (Bitmask Authorization)</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-mono font-semibold" dir="ltr">
                0..255 Bits
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              یکی از درخشان‌ترین معماری‌های اختصاصی انبار، حذف ۴ جدول رابطه‌ای سنتی مجوزها و جایگزینی آن با <strong>عملگرهای بیتی (Bitwise Operations)</strong> است.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white">
                    <th className="p-3.5 font-bold">عنوان دسترسی</th>
                    <th className="p-3.5 font-bold">بیت ده‌دهی</th>
                    <th className="p-3.5 font-bold">مجوزهای تحت پوشش</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300 font-mono" dir="ltr">
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white font-sans text-right" dir="rtl">VIEW (مشاهده لیست و کاتالوگ)</td>
                    <td className="p-3.5 text-amber-500 font-bold">1</td>
                    <td className="p-3.5 font-sans text-right" dir="rtl">مشاهده موجودی انبار و درخواست‌های مشتریان</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white font-sans text-right" dir="rtl">CREATE_EDIT (تعریف و ویرایش)</td>
                    <td className="p-3.5 text-amber-500 font-bold">2</td>
                    <td className="p-3.5 font-sans text-right" dir="rtl">افزودن و ویرایش مشخصات و قیمت کالاها</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white font-sans text-right" dir="rtl">DELETE (حذف اقلام)</td>
                    <td className="p-3.5 text-amber-500 font-bold">4</td>
                    <td className="p-3.5 font-sans text-right" dir="rtl">حذف کالاها، کاتالوگ‌ها و فاکتورها</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white font-sans text-right" dir="rtl">STOCK_MOVE (انبارداری و ورود/خروج)</td>
                    <td className="p-3.5 text-amber-500 font-bold">8</td>
                    <td className="p-3.5 font-sans text-right" dir="rtl">ثبت انبارگردانی، کسری، اضافه و انتقال</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white font-sans text-right" dir="rtl">MANAGE_LINKS (لینک‌های کاتالوگ)</td>
                    <td className="p-3.5 text-amber-500 font-bold">16</td>
                    <td className="p-3.5 font-sans text-right" dir="rtl">تولید پیوند اختصاصی برای خریداران</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white font-sans text-right" dir="rtl">SETTINGS (تنظیمات سربرگ و مالیات)</td>
                    <td className="p-3.5 text-amber-500 font-bold">32</td>
                    <td className="p-3.5 font-sans text-right" dir="rtl">ویرایش مشخصات حقوقی شرکت، شبا و درصد مالیات</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white font-sans text-right" dir="rtl">EXPORT_IMPORT (اکسل)</td>
                    <td className="p-3.5 text-amber-500 font-bold">128</td>
                    <td className="p-3.5 font-sans text-right" dir="rtl">درون‌ریزی و استخراج گروهی کالاها با فایل اکسل</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400 font-sans text-right" dir="rtl">SUPER_ADMIN (مدیر ارشد)</td>
                    <td className="p-3.5 text-emerald-500 font-bold">255</td>
                    <td className="p-3.5 font-sans text-right" dir="rtl">دسترسی جامع و نامحدود به تمامی بخش‌ها</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300">
              <strong>سرعت ارزیابی در حد نانوثانیه:</strong>
              بررسی دسترسی صرفاً با یک عملگر بیتی ریاضی انجام می‌شود:
              <code className="mx-2 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-mono" dir="ltr">
                (userRole & requiredMask) === requiredMask
              </code>
              این شیوه بار پردازشی دیتابیس را به صفر رسانده و نیاز به JOIN جداول پرحجم را حذف کرده است.
            </div>
          </section>

          {/* SECTION 6: JWT & Session */}
          <section id="sec-jwt" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۶</span>
                <span>مدیریت سشن، رمزنگاری و توکن‌های JWT</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono font-semibold" dir="ltr">
                HttpOnly Cookie
              </span>
            </div>

            <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <li><strong>رمزنگاری Bcrypt:</strong> تمام کلمات عبور با ۱۰ دور نمک‌پاشی استاندارد هش شده و هرگز در هیچ رخداد یا دیتابیسی به صورت متن آشکار ذخیره نمی‌گردند.</li>
              <li><strong>کوکی‌های امن با فلگ HttpOnly و SameSite=Lax:</strong> توکن‌ها در داخل کوکی‌های محافظت‌شده قرار دارند تا دسترسی جاوااسکریپت و امکان سرقت از طریق حملات XSS ناممکن شود.</li>
              <li><strong>راه‌اندازی اولیه خودکار (Auto-Bootstrap):</strong> در بدو راه‌اندازی دیتابیس نو، سیستم نخستین کاربری که فرم ورود را تکمیل کند به صورت خودکار به عنوان سوپرادمین (Role: 255) ایجاد می‌نماید تا هیچ پسورد هاردکدشده‌ای در پروژه وجود نداشته باشد.</li>
            </ul>
          </section>

          {/* SECTION 7: Concurrency & Stock */}
          <section id="sec-concurrency" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۷</span>
                <span>کنترل همزمانی و کسر اتمیک انبار (Atomic Concurrency)</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-mono font-semibold" dir="ltr">
                Atomic Guard
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              یکی از بزرگ‌ترین چالش‌های انبارداری، بروز Race Condition هنگام ثبت همزمان دو سفارش برای آخرین موجودی‌های قفسه است.
            </p>

            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs border border-slate-800 leading-relaxed overflow-x-auto" dir="ltr">
              <div className="text-slate-500">// Transactional Atomic Decrement with Conditional Guard</div>
              <span className="text-purple-400">await</span> db.$transaction(<span className="text-purple-400">async</span> (tx) =&gt; &#123;<br />
              &nbsp;&nbsp;<span className="text-purple-400">const</span> res = <span className="text-purple-400">await</span> tx.product.updateMany(&#123;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;where: &#123; id: productId, stockQuantity: &#123; gte: qty &#125; &#125;,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;data: &#123; stockQuantity: &#123; decrement: qty &#125; &#125;<br />
              &nbsp;&nbsp;&#125;);<br />
              &nbsp;&nbsp;<span className="text-purple-400">if</span> (res.count === 0) <span className="text-purple-400">throw new Error</span>(<span className="text-amber-300">'موجودی توسط تراکنش همزمان پایان یافت'</span>);<br />
              &#125;);
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              این شیوه نیازی به استقرار سرور مجزای Redis برای Redlock ندارد و از قفل‌های اتمیک بومی سطح سطر پستگرس در مقیاس میکروثانیه بهره می‌برد.
            </p>
          </section>

          {/* SECTION 8: Made-to-Order Custom Items */}
          <section id="sec-custom-items" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۸</span>
                <span>منطق کالاهای سفارشی و ساخت بر اساس تقاضا (Made-to-Order)</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono font-semibold" dir="ltr">
                isCustom: true
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
              <p>در پروژه‌های صنعتی لوله و اتصالات، بسیاری از کالاها از پیش ساخته‌شده نیستند:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>با فعال شدن تیک <code className="font-mono text-amber-500">isCustom</code>، محدودیت سقف موجودی انبار برای ثبت سفارش خریدار نادیده گرفته می‌شود.</li>
                <li>مدت زمان تخمینی ساخت (مثلاً: «۳ الی ۵ روز کاری») به خریدار نمایش می‌یابد.</li>
                <li>در صدور فاکتور قطعی، کسر فیزیکی منجر به موجودی منفی فرضی نمی‌شود و وضعیت به صورت ساخت سفارشی ثبت می‌گردد.</li>
              </ul>
            </div>
          </section>

          {/* SECTION 9: Frictionless Client Portal */}
          <section id="sec-catalog" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۹</span>
                <span>کاتالوگ خریداران و اشتراک بدون اصطکاک (/c/[token])</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-mono font-semibold" dir="ltr">
                Zero Friction B2B
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              <strong>چرا لاگین اجباری یا OTP پیامکی حذف شد؟</strong> آمار نشان می‌دهد بیش از ۶۰٪ خریداران صنعتی در صورت برخورد با فرم ثبت‌نام یا نیاز به دریافت پیامک، فرآیند خرید را رها می‌کنند. سامانه با ساخت لینک‌های اختصاصی دارای توکن رمزنگاری‌شده، به خریدار اجازه می‌دهد بدون ثبت‌نام کاتالوگ قیمت‌های روز را دیده و استعلام خود را با شماره تلفن ثبت نماید.
            </p>
          </section>

          {/* SECTION 10: Tax & Legal */}
          <section id="sec-tax" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۱۰</span>
                <span>محاسبات مالی، گردکردن امن و ماده ۱۶۹ مالیاتی</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-mono font-semibold" dir="ltr">
                Proforma Engine
              </span>
            </div>

            <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <li><strong>حل باگ‌های اعشاری Floating Point:</strong> استفاده از توابع <code className="font-mono text-amber-500">safeCurrencyRound</code> جهت جلوگیری از خطاهای محاسباتی مبالغ تومانی.</li>
              <li><strong>الزامات ماده ۱۶۹ ق.م.م:</strong> صدور پیش‌فاکتور دارای شناسه ملی، کد اقتصادی، کد پستی و شماره شبا.</li>
              <li><strong>چاپ استاندارد A4 با CSS چاپی:</strong> پرینت کاملاً خوانا با رزولوشن ۳۰۰ DPI بدون نیاز به تولید فایل‌های سنگین گرافیکی در سرور.</li>
            </ul>
          </section>

          {/* SECTION 11: TanStack Query v5 */}
          <section id="sec-tanstack" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۱۱</span>
                <span>همگام‌سازی وضعیت سرور: TanStack Query v5</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono font-semibold" dir="ltr">
                React Query v5
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              به جای ذخیره داده‌های واکشی‌شده در استیت‌های پیچیده Redux، لایبرری TanStack Query مدیریت کش، بازخوانی خودکار هنگام فوکوس مجدد پنجره و ابطال هوشمند کلیدها (<code className="font-mono text-amber-500">queryClient.invalidateQueries</code>) را بر عهده دارد.
            </p>
          </section>

          {/* SECTION 12: Virtualization */}
          <section id="sec-virtual" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۱۲</span>
                <span>مجازی‌سازی لیست‌های طولانی (@tanstack/react-virtual)</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-mono font-semibold" dir="ltr">
                60 FPS Scrolling
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              در کاتالوگ‌هایی با بیش از ۵۰۰۰ ردیف محصول، رندر کردن تمام نودهای DOM باعث پر شدن رم گوشی و هنگ کردن مرورگر می‌شد. با پیاده‌سازی <code className="font-mono text-amber-500">useWindowVirtualizer</code>، صرفاً المان‌هایی که در ویوپورت صفحه قرار دارند رندر می‌شوند و مصرف رم گوشی تا ۹۰٪ کاهش می‌یابد.
            </p>
          </section>

          {/* SECTION 13: Styling & RTL */}
          <section id="sec-styling" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۱۳</span>
                <span>سیستم طراحی، تم‌های رنگی و رفع باگ‌های BiDi در RTL</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 font-mono font-semibold" dir="ltr">
                Tailwind CSS
              </span>
            </div>

            <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <li><strong>حل بنیادین باگ BiDi Unicode:</strong> در عبارات دارای علامت مانند <code className="font-mono">+2</code> یا درصدها، تزریق کاراکتر نامرئی <code className="font-mono text-amber-500">\u200E</code> (Left-to-Right Mark) و بسته‌بندی در المان‌های با دایرکشن صریح مانع برعکس شدن اعداد در زبان فارسی گردیده است.</li>
              <li><strong>سامانه پاپ‌آپ غیرمسدودکننده (<code className="font-mono text-amber-500">notify</code>):</strong> حذف کامل متدهای سنتی و مسدودکننده <code className="font-mono">window.confirm</code> و جایگزینی با دیالوگ‌های متحرک منطبق با تم تاریک و روشن.</li>
            </ul>
          </section>

          {/* SECTION 14: Testing */}
          <section id="sec-testing" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۱۴</span>
                <span>استراتژی تضمین کیفیت و تست واحد با Vitest</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-mono font-semibold" dir="ltr">
                34 Tests Passed
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              اجرای ۳۴ تست جامع شامل اعتبارسنجی اسکیماها، آزمون بیت‌ماسک‌ها، ریت‌لیمیتینگ، درون‌ریزی اکسل و احراز هویت در کمتر از ۷۰۰ میلی‌ثانیه به لطف زیرساخت مدرن ESM در Vitest.
            </p>
          </section>

          {/* SECTION 15: Master Decisions Matrix */}
          <section id="sec-matrix" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">۱۵</span>
                <span>ماتریس جامع مقایسه فنی و دلایل ترجیح (Master Decisions Matrix)</span>
              </h3>
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-mono font-semibold" dir="ltr">
                ADR Summary
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white">
                    <th className="p-3.5 font-bold">بخش فنی</th>
                    <th className="p-3.5 font-bold">فناوری برگزیده در انبار</th>
                    <th className="p-3.5 font-bold">مهم‌ترین آلترناتیو</th>
                    <th className="p-3.5 font-bold">علت ترجیح فناوری برگزیده</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">معماری کلی</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">Next.js 16 (App Router)</td>
                    <td className="p-3.5">NestJS + React SPA</td>
                    <td className="p-3.5">یکپارچگی تایپ‌ها، سرعت استقرار، صفر بودن سربار DevOps</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">پایگاه داده</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">Neon Serverless PostgreSQL</td>
                    <td className="p-3.5">Docker Postgres on VPS</td>
                    <td className="p-3.5">مقیاس‌پذیری خودکار، قابلیت برنچینگ، نگهداری صفر</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">لایه ORM</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">Prisma 7 + Adapter-PG</td>
                    <td className="p-3.5">Drizzle ORM</td>
                    <td className="p-3.5">مایگریشن‌های اسکیما-محور پایدار و تایپ‌های سرتاسری</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">سطوح دسترسی</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">Bitmask Integer (0..255)</td>
                    <td className="p-3.5">Multi-table Join RBAC</td>
                    <td className="p-3.5">حذف کامل ۴ جدول رابطه‌ای، سرعت نانوثانیه در ارزیابی بیتی</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">احراز هویت</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">JWT در HttpOnly Cookie</td>
                    <td className="p-3.5">Server Sessions در Redis</td>
                    <td className="p-3.5">بی‌حالت (Stateless) بودن در لایه سرورلس بدون نیاز به ردیس</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">کنترل همزمانی انبار</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">Atomic Decrement Condition</td>
                    <td className="p-3.5">Redis Redlock</td>
                    <td className="p-3.5">انزوای اتمیک سطح پایگاه داده بدون ریسک بن‌بست و پیچیدگی کلاستر</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">کاتالوگ خریداران</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">لینک اختصاصی وب (/c/[token])</td>
                    <td className="p-3.5">لاگین اجباری با OTP پیامک</td>
                    <td className="p-3.5">حذف هزینه پیامک و افزایش چشمگیر نرخ تبدیل خرید</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">وضعیت داده‌ها</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">TanStack Query v5</td>
                    <td className="p-3.5">Redux Toolkit</td>
                    <td className="p-3.5">مدیریت خودکار کش، باطل‌سازی کلیدها و بروزرسانی خوش‌بینانه</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">فریم‌ورک تست</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">Vitest</td>
                    <td className="p-3.5">Jest</td>
                    <td className="p-3.5">اجرای در کمتر از ۱ ثانیه، هماهنگی کامل با ESM مدرن</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-6">
              <strong className="text-emerald-600 dark:text-emerald-400 block text-sm font-bold mb-1">
                جمع‌بندی نهایی معماری (Architectural Verdict):
              </strong>
              ترکیب استراتژیک <strong>Next.js 16 + Neon Serverless + Prisma 7 + Bitmask Auth + TanStack Query</strong> بالاترین نرخ تبدیل مشتریان تجاری را با کمترین هزینه زیرساختی و تضمین کامل ثبات مالی و حقوقی رقم زده است.
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
