# Anbar Project Requirements & Specification Document (PRD)

## 1. Project Overview & Vision
**Anbar** is a private, bespoke Inventory Management and Invoicing / Proforma system designed for a business/warehouse operator. Rather than being a public open-registration e-commerce store, it serves as a streamlined internal and client-facing B2B platform to track warehouse inventory, present available products to clients, accept product requests, and issue quotations (proforma invoices) and finalized invoices.

---

## 2. Core Stakeholders & User Roles

### A. Admin / Warehouse Operator
- **Inventory Control:** Add, update, and manage product specifications, pricing, units of measurement, and real-time stock levels.
- **Quotation & Order Review:** Receive real-time requests submitted by clients, review quantities, adjust pricing/discounts if needed, and issue proforma invoices.
- **Invoice Finalization:** Convert proforma invoices into finalized sales invoices and deduct stock accordingly.
- **Data Exchange:** Import/export product and inventory data via Excel (`.xlsx`), and generate PDF documents.

### B. Client / Customer (External Users)
- **Controlled Catalog Access:** Browse available inventory items, view specifications and current availability.
- **Self-Service Order / Quote Request:** Select desired items, pick requested quantities, and submit requests directly through the web platform.
- **Document Access:** View and download proforma invoices / invoices prepared for their requests.

---

## 3. Functional Requirements & Feature Breakdown

### 3.1 Inventory & Warehouse Management (`انبارداری`)
- **Product Registry:**
  - Product Code / SKU
  - Name / Title
  - Technical specifications and custom attributes
  - Unit of measure (e.g., piece, box, kg, meter)
  - Unit base price
  - Available stock quantity
- **Stock Movement & Tracking:**
  - Real-time stock decrement upon invoice issuance/order fulfillment.
  - Stock updates (manual adjustments or bulk batch updates).
  - Out-of-stock and low-stock indicators.

### 3.2 Client Request & Presentation Flow (`کاتالوگ و ثبت درخواست`)
- **Private/Protected Catalog:**
  - Clean, responsive interface for clients to view available goods.
  - Search, filter by category/attributes, and check stock availability.
- **Cart / Request Builder:**
  - Clients choose items and specify requested quantities.
  - Validation ensuring requested quantities align with stock constraints.
  - Submission mechanism notifying the warehouse operator.

### 3.3 Proforma Invoices & Official Invoices (`پیش‌فاکتور و فاکتور`)
- **Proforma Invoices (پیش‌فاکتور):**
  - Generated automatically from client submissions or created manually by the admin.
  - Includes quotation validity period, payment terms, and itemized cost breakdown.
- **Sales Invoices (فاکتور فروش):**
  - Ability to convert an accepted proforma invoice into an official invoice with one click.
  - Calculates line totals, discounts, taxes (if applicable), and grand total.
  - Updates inventory records upon finalization.

### 3.4 Excel Integration (`خوردن و نوشتن اکسل`)
- **Import:** Bulk upload and update products, specifications, and initial stock quantities from `.xlsx` files.
- **Export:** Export product lists, current inventory levels, sales summaries, and invoice logs to `.xlsx` sheets.

### 3.5 PDF Generation (`ساخت فایل پی‌دی‌اف`)
- **Print-Ready Invoices & Proforma:**
  - Generate clean, standardized PDF invoices for download, printing, or sending to clients.
  - Proper layout including business logo, header, buyer info, tabular item list, payment terms, notes, and stamp/signature area.
  - Robust RTL (Persian) typography and formatting (correct handling of numbers, Rial/Toman currencies, and Jalali dates).

---

## 4. Key Technical & Architectural Considerations
1. **Localization & RTL Standards:**
   - Full Persian (Farsi) UI support with Jalali (Shamsi) calendar picker and formatting.
   - Careful Bidirectional (BiDi) handling for numbers, formulas, and currency signs (ensuring numbers and symbols do not reverse).
2. **Access Control & Privacy:**
   - Role-based authentication (Admin vs. Authorized Client).
   - Private links or client credentials to restrict catalog viewing to intended partners.
3. **Data Integrity:**
   - Transactional safety for inventory deduction when invoices are confirmed.
   - Consistent database modeling with proper audit trails (created at, updated at, status tracking).

---

## 5. Development Roadmap & Next Steps
- [ ] **Phase 1: Architecture & Technology Stack Selection** (Framework, Database, ORM, Auth).
- [ ] **Phase 2: Database Schema & Core Data Modeling** (Products, Categories, Invoices, InvoiceItems, Customers).
- [ ] **Phase 3: Inventory Management Module** (Admin CRUD + Excel Import/Export).
- [ ] **Phase 4: Client Catalog & Request Submission Portal**.
- [ ] **Phase 5: Invoicing Engine & PDF Export**.
