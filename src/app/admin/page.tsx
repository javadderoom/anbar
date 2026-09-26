'use client';

import React, { useState } from 'react';
import AdminSidebar, { type AdminTab } from '@/components/admin/AdminSidebar';
import AdminBottomNav from '@/components/admin/AdminBottomNav';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminKpiCards from '@/components/admin/AdminKpiCards';
import InventoryModule from '@/components/admin/InventoryModule';
import ClientLinksModule, { type ClientLinkItem } from '@/components/admin/ClientLinksModule';
import OrderRequestsModule, { type OrderRequestItem } from '@/components/admin/OrderRequestsModule';
import SettingsModule from '@/components/admin/SettingsModule';
import InvoicePrintModal from '@/components/InvoicePrintModal';
import type { Product, Invoice } from '@/types';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('inventory');

  // Initial Sample Inventory
  const [products, setProducts] = useState<Product[]>([
    { id: 'p1', sku: 'ANB-101', name: 'لوله فولادی گالوانیزه ۲ اینچ', category: 'لوله‌ها', unit: 'شاخه ۶ متری', unitPrice: 1850000, stockQuantity: 45, minStockAlert: 10, isActive: true },
    { id: 'p2', sku: 'ANB-102', name: 'شیر فلکه کشویی برنجی ۱ اینچ', category: 'اتصالات', unit: 'عدد', unitPrice: 420000, stockQuantity: 120, minStockAlert: 20, isActive: true },
    { id: 'p3', sku: 'ANB-103', name: 'فلنج جوشی گلودار کلاس ۱۵۰', category: 'فلنج‌ها', unit: 'عدد', unitPrice: 950000, stockQuantity: 8, minStockAlert: 15, isActive: true },
    { id: 'p4', sku: 'ANB-104', name: 'واشر لاستیکی منجیددار فشار قوی', category: 'اتصالات', unit: 'بسته ۵۰ تایی', unitPrice: 320000, stockQuantity: 65, minStockAlert: 15, isActive: true },
    { id: 'p5', sku: 'ANB-105', name: 'الکترود جوشکاری ۶۰۱۳ سایز ۳.۲', category: 'ابزار', unit: 'بسته ۵ کیلویی', unitPrice: 680000, stockQuantity: 4, minStockAlert: 10, isActive: true },
  ]);

  // Initial Sample Client Links
  const [links, setLinks] = useState<ClientLinkItem[]>([
    { id: 'l1', token: 'reza-steel', clientName: 'حاج رضا کریمی (فولاد غرب)', phone: '۰۹۱۲۳۴۵۶۷۸۹', createdDate: '۱۴۰۳/۰۷/۰۱', requestCount: 3, isActive: true },
    { id: 'l2', token: 'pars-oil-99', clientName: 'شرکت نفت و گاز پارس', phone: '۰۹۱۸۱۱۱۲۲۳۳', createdDate: '۱۴۰۳/۰۷/۰۳', requestCount: 1, isActive: true },
    { id: 'l3', token: 'guest-open-01', clientName: 'لینک عمومی خریداران استعلامی', phone: 'عمومی / مهمان', createdDate: '۱۴۰۳/۰۷/۰۴', requestCount: 7, isActive: true },
  ]);

  // Initial Sample Requests
  const [requests, setRequests] = useState<OrderRequestItem[]>([
    {
      id: 'r1',
      orderNumber: 'REQ-1042',
      clientName: 'حاج رضا کریمی (فولاد غرب)',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      itemsCount: 2,
      totalEstimate: 14750000,
      status: 'PENDING',
      date: 'امروز، ۱۰:۴۵',
      items: [
        { id: 'ri1', productId: 'p1', description: 'لوله فولادی گالوانیزه ۲ اینچ', quantity: 5, unit: 'شاخه ۶ متری', unitPrice: 1850000, totalPrice: 9250000 },
        { id: 'ri2', productId: 'p3', description: 'فلنج جوشی گلودار کلاس ۱۵۰', quantity: 6, unit: 'عدد', unitPrice: 950000, totalPrice: 5700000 },
      ],
    },
    {
      id: 'r2',
      orderNumber: 'REQ-1041',
      clientName: 'پیمانکاری سپهر',
      phone: '۰۹۳۵۰۰۰۱۱۲۲',
      itemsCount: 1,
      totalEstimate: 3360000,
      status: 'CONVERTED',
      date: 'دیروز، ۱۶:۲۰',
      items: [
        { id: 'ri3', productId: 'p2', description: 'شیر فلکه کشویی برنجی ۱ اینچ', quantity: 8, unit: 'عدد', unitPrice: 420000, totalPrice: 3360000 },
      ],
    },
  ]);

  // Invoice Print Preview Modal State
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);

  const handleOpenPrintPreview = (req: OrderRequestItem, type: 'PROFORMA' | 'SALES' = 'PROFORMA') => {
    const invoiceData: Invoice = {
      id: 'inv-' + req.id,
      invoiceNumber: type === 'PROFORMA' ? `PRO-${req.orderNumber}` : `INV-${req.orderNumber}`,
      type,
      status: type === 'PROFORMA' ? 'ISSUED' : 'PAID',
      client: {
        id: 'c-req',
        name: req.clientName,
        phone: req.phone,
        isGuest: true,
        createdAt: req.date,
        updatedAt: req.date,
      },
      orderRequestId: req.id,
      subtotal: req.totalEstimate,
      discount: 0,
      tax: 0,
      total: req.totalEstimate,
      issuedDate: '۱۴۰۳/۰۷/۰۵',
      dueDate: '۱۴۰۳/۰۷/۰۸',
      items: req.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        description: i.description,
        unit: i.unit,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice,
      })),
    };

    setSelectedInvoiceForPrint(invoiceData);
  };

  const lowStockCount = products.filter((p) => p.stockQuantity <= p.minStockAlert).length;
  const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      {/* Desktop Sidebar (hidden on mobile) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 pb-28 md:pb-8 space-y-6">
          {/* KPI Summary Cards (shown on primary management tabs) */}
          {activeTab !== 'settings' && (
            <AdminKpiCards
              productsCount={products.length}
              lowStockCount={lowStockCount}
              linksCount={links.length}
              pendingRequestsCount={pendingRequestsCount}
            />
          )}

          {/* Active Module */}
          {activeTab === 'inventory' && (
            <InventoryModule
              products={products}
              setProducts={setProducts}
            />
          )}

          {activeTab === 'links' && (
            <ClientLinksModule
              links={links}
              setLinks={setLinks}
            />
          )}

          {activeTab === 'requests' && (
            <OrderRequestsModule
              requests={requests}
              setRequests={setRequests}
              setProducts={setProducts}
              onOpenPrintPreview={handleOpenPrintPreview}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsModule />
          )}
        </main>
      </div>

      {/* Mobile Native Bottom Navigation Bar (hidden on desktop) */}
      <AdminBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasPendingRequests={pendingRequestsCount > 0}
      />

      {/* Printable Invoice & Proforma Modal */}
      {selectedInvoiceForPrint && (
        <InvoicePrintModal
          invoice={selectedInvoiceForPrint}
          isOpen={!!selectedInvoiceForPrint}
          onClose={() => setSelectedInvoiceForPrint(null)}
        />
      )}
    </div>
  );
}
