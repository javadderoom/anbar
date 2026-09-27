'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Warehouse,
  FileText,
  CreditCard,
  Save,
  Check,
  ShieldCheck,
  Download,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { WarehouseSettingsSchema } from '@/lib/validations';
import { notify } from '@/lib/notify';

export interface WarehouseSettings {
  businessName: string;
  phone: string;
  mobile: string;
  nationalId: string;
  economicCode: string;
  postalCode: string;
  address: string;
  bankAccount: string;
  taxPercent: number;
  proformaValidityHours: number;
  defaultTerms: string;
}

const DEFAULT_SETTINGS: WarehouseSettings = {
  businessName: '',
  phone: '',
  mobile: '',
  nationalId: '',
  economicCode: '',
  postalCode: '',
  address: '',
  bankAccount: '',
  taxPercent: 0,
  proformaValidityHours: 48,
  defaultTerms: '۱. اعتبار قیمت‌های مندرج در پیش‌فاکتور حداکثر ۴۸ ساعت پس از صدور می‌باشد.\n۲. بارگیری و تحویل اقلام پس از تسویه حساب نهایی انجام خواهد شد.',
};

export default function SettingsModule() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<WarehouseSettings>(DEFAULT_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('anbar-business-settings');
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (_) {}
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const result = WarehouseSettingsSchema.safeParse(settings);
    if (!result.success) {
      notify.error(result.error.issues[0].message);
      return;
    }

    localStorage.setItem('anbar-business-settings', JSON.stringify(result.data));
    setSavedSuccess(true);
    notify.success('تنظیمات انبار و فاکتور با موفقیت ذخیره گردید');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    const backupData = {
      settings,
      theme,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anbar-settings-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Title & Save Button Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" />
            <span>تنظیمات سامانه و ظاهر</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            شخصی‌سازی ظاهر، تم روشن و تاریک، و مشخصات کسب‌وکار جهت درج روی فاکتورها
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-slate-950" />
              <span>ذخیره شد!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>ذخیره تغییرات</span>
            </>
          )}
        </button>
      </div>

      {/* SECTION 1: Appearance & Theme */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>حالت نمایش و تم سامانه</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Light Theme Card */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-right transition-all flex items-center gap-3 ${
              theme === 'light'
                ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white ring-2 ring-amber-500/20 font-bold'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold block">حالت روشن (Light)</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                محیط پرنور و شفاف
              </span>
            </div>
          </button>

          {/* Dark Theme Card */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-right transition-all flex items-center gap-3 ${
              theme === 'dark'
                ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white ring-2 ring-amber-500/20 font-bold'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold block">حالت تاریک (Dark)</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                محیط مدرن و مناسب شب
              </span>
            </div>
          </button>

          {/* System Theme Card */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-xl border text-right transition-all flex items-center gap-3 ${
              theme === 'system'
                ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-white ring-2 ring-amber-500/20 font-bold'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-500 flex items-center justify-center shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold block">همگام با سیستم (System)</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                تطبیق خودکار با تنظیمات گوشی/ویندوز
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 2: Business & Warehouse Information */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Warehouse className="w-4 h-4 text-amber-500" />
          <span>مشخصات بازرگانی و انبار (جهت درج در سربرگ فاکتور)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              نام کسب‌وکار / انبار
            </label>
            <input
              type="text"
              placeholder="مثال: بازرگانی و انبار مرکزی"
              value={settings.businessName}
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              تلفن ثابت انبار
            </label>
            <input
              type="text"
              placeholder="مثال: ۰۲۱-۸۸۸۸۸۸۸۸"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-left"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              شماره همراه پشتیبانی / استعلام
            </label>
            <input
              type="tel"
              placeholder="مثال: ۰۹۱۲۰۰۰۰۰۰۰"
              value={settings.mobile}
              onChange={(e) => setSettings({ ...settings, mobile: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-left"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              شماره شبا یا شماره کارت جهت واریز
            </label>
            <input
              type="text"
              placeholder="مثال: IR000000000000000000000000"
              value={settings.bankAccount}
              onChange={(e) => setSettings({ ...settings, bankAccount: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-left"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              شناسه ملی / کد ملی (فروشنده)
            </label>
            <input
              type="text"
              placeholder="مثال: ۱۰۱۰۳۰۰۰۰۰۰"
              value={settings.nationalId || ''}
              onChange={(e) => setSettings({ ...settings, nationalId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-left"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              شماره اقتصادی (ماده ۱۶۹)
            </label>
            <input
              type="text"
              placeholder="مثال: ۴۱۱۱۰۰۰۰۰۰۰۰"
              value={settings.economicCode || ''}
              onChange={(e) => setSettings({ ...settings, economicCode: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-left"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              کد پستی ۱۰ رقمی انبار
            </label>
            <input
              type="text"
              placeholder="مثال: ۱۱۵۱۰۰۰۰۰۰"
              value={settings.postalCode || ''}
              onChange={(e) => setSettings({ ...settings, postalCode: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-left"
              dir="ltr"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              آدرس و محل تحویل بار انبار
            </label>
            <input
              type="text"
              placeholder="مثال: تهران، بازار بزرگ، مجتمع صنعتی انبار"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Invoicing Defaults */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-500" />
          <span>تنظیمات پیش‌فرض صدور فاکتور و پیش‌فاکتور</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              درصد مالیات بر ارزش افزوده پیش‌فرض (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={settings.taxPercent}
              onChange={(e) =>
                setSettings({ ...settings, taxPercent: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-left"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              مدت اعتبار پیش‌فاکتور (ساعت)
            </label>
            <input
              type="number"
              min={1}
              value={settings.proformaValidityHours}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  proformaValidityHours: parseInt(e.target.value) || 48,
                })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-left"
              dir="ltr"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              متن شرایط و قوانین مندرج در ذیل پیش‌فاکتور
            </label>
            <textarea
              rows={3}
              value={settings.defaultTerms}
              onChange={(e) => setSettings({ ...settings, defaultTerms: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Documentation & Guides */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>مستندات و راهنمای سامانه</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            مشاهده آنلاین و دانلود نسخه قابل چاپ (PDF) راهنماهای سامانه
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="/docs/user-guide.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  راهنمای جامع مدیران و انبارداری
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  آموزش انبارگردانی، صدور فاکتور و تنظیمات
                </div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
          </a>

          <a
            href="/docs/client-guide.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Warehouse className="w-4 h-4 text-emerald-500" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  راهنمای خریداران و کاتالوگ آنلاین
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  آموزش استعلام، کالاهای سفارشی و ثبت سبد
                </div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
          </a>
        </div>
      </div>

      {/* SECTION 5: Data & Backup */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>پشتیبان‌گیری از تنظیمات و داده‌ها</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            دریافت فایل پشتیبان پیکربندی‌ها در قالب JSON
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportBackup}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all active:scale-95 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-blue-500" />
          <span>دانلود فایل پشتیبان (JSON)</span>
        </button>
      </div>
    </form>
  );
}
