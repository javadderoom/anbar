'use client';

import React, { useState } from 'react';
import AdminSidebar, { type AdminTab } from '@/components/admin/AdminSidebar';
import AdminBottomNav from '@/components/admin/AdminBottomNav';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminKpiCards from '@/components/admin/AdminKpiCards';
import InventoryModule from '@/components/admin/InventoryModule';
import ClientLinksModule from '@/components/admin/ClientLinksModule';
import OrderRequestsModule, { type OrderRequestItem } from '@/components/admin/OrderRequestsModule';
import SettingsModule from '@/components/admin/SettingsModule';
import InvoicePrintModal from '@/components/InvoicePrintModal';
import { useProducts, useClientLinks, useOrderRequests } from '@/hooks';
import type { Invoice } from '@/types';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('inventory');

  // TanStack Query v5 state management with live cache synchronization
  const {
    data: products = [],
    isLoading: isProductsLoading,
    refetch: refetchProducts,
  } = useProducts();

  const {
    data: links = [],
    isLoading: isLinksLoading,
    refetch: refetchLinks,
  } = useClientLinks();

  const {
    data: requests = [],
    isLoading: isRequestsLoading,
    refetch: refetchRequests,
  } = useOrderRequests({ refetchInterval: 15000 }); // 15s liveness polling for warehouse order requests

  const handleRefreshAll = () => {
    refetchProducts();
    refetchLinks();
    refetchRequests();
  };

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
      issuedDate: req.date,
      notes: req.notes,
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
              isLoading={isProductsLoading}
              onRefresh={handleRefreshAll}
            />
          )}

          {activeTab === 'links' && (
            <ClientLinksModule
              links={links}
              isLoading={isLinksLoading}
            />
          )}

          {activeTab === 'requests' && (
            <OrderRequestsModule
              requests={requests}
              onOpenPrintPreview={handleOpenPrintPreview}
              isLoading={isRequestsLoading}
              onRefresh={handleRefreshAll}
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
