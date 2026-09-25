# Anbar Project Requirements & Specification Document (PRD)

## 1. Project Overview & Vision
**Anbar** is a bespoke, private Inventory Management, Quotation (Proforma), and Invoicing system designed for warehouse operators and businesses. Rather than an open, self-registration e-commerce store, it serves as an exclusive, zero-friction B2B portal. 

The business owner can manage inventory, track stock levels, and share customized, dedicated catalog links with specific clients. Clients can browse current stock, specify required quantities, and submit quote/order requests without creating an account or logging in.

---

## 2. Core Stakeholders & Access Patterns

### A. Admin / Warehouse Operator
- **Full Operational Control:** Add, update, and manage inventory, product specifications, unit pricing, and stock levels.
- **Dedicated Link Generator:** Generate custom, tokenized links for clients (or anonymous guests).
- **Request & Order Review:** Monitor incoming client requests in real time, adjust quantities or discounts, and generate proforma invoices.
- **Invoice Conversion:** Finalize proforma invoices into official sales invoices with automatic inventory decrement.
- **Data Exchange:** Import/export product data via Excel (`.xlsx`) and generate official PDF invoices/proformas.
- **Client Promotion:** Convert guest requests/tokens into formal client records or keep them as guests.

### B. Client / Customer (Zero-Friction Access)
- **No Registration Required:** Clients never need to sign up or remember passwords.
- **Dedicated / Magic Link Access:** Access the catalog via a unique, personalized link provided by the admin.
- **Mobile-First Experience:** Seamless browsing on smartphones with responsive product cards, attribute inspectors, and quick-add controls.
- **Direct Request Submission:** Add items and quantities to a request basket and submit directly through the site with immediate confirmation.

---

## 3. Functional Requirements & Feature Breakdown

### 3.1 Inventory & Warehouse Management (`انبارداری`)
- **Product Registry:**
  - SKU / Product Code
  - Title / Name
  - Detailed technical specifications & custom key-value attributes
  - Units of measure (e.g., Piece, Box, Kg, Meter, Roll)
  - Unit base price (in IRR / Tomans)
  - Available stock quantity
- **Stock Movement & Audit:**
  - Real-time stock decrement upon invoice confirmation.
  - Manual stock adjustments with notes (e.g., restock, damage, return).
  - Out-of-stock and low-stock alerts.

### 3.2 Dedicated Client Links & Self-Service Ordering (`لینک‌های اختصاصی و ثبت سفارش`)
- **Tokenized Access:** Admin generates unique shareable links (e.g., `/c/[clientToken]`).
- **Client Association:** Links can be pre-tagged with a client's name/phone or generated as a generic guest link.
- **Instant Request Submission:** When an order is submitted from a link:
  - Automatically ties the request to that client/token.
  - Admin receives real-time notification of the new request.
  - Admin can convert the guest order into a permanent client profile or leave it as a one-time guest order.

### 3.3 Invoicing & Proforma Management (`پیش‌فاکتور و فاکتور`)
- **Proforma Invoices (پیش‌فاکتور):**
  - Generated from client requests or created manually by admin.
  - Custom validity dates, payment instructions, discounts, and line-item notes.
- **Sales Invoices (فاکتور فروش):**
  - One-click transformation from Proforma to finalized Invoice.
  - Immediate stock deduction and audit record creation.
  - Status tracking (Draft, Issued, Paid, Cancelled).

### 3.4 Excel Integration (`ورود و خروج اکسل`)
- **Import:** Bulk upload and update products, specifications, and initial quantities via `.xlsx`.
- **Export:** Export stock lists, client request logs, and invoice histories to `.xlsx`.

### 3.5 PDF Document Generation (`ساخت فایل پی‌دی‌اف`)
- **Print-Ready Documents:**
  - Clean, standardized PDF invoices and proformas.
  - Proper layout with company logo, buyer info, itemized table, total breakdowns, payment terms, and stamp/signature box.
  - Strict RTL Persian typography, Jalali dates, and clean number/symbol formatting.

---

## 4. UI / UX & Design Principles

### 4.1 Mobile-First Philosophy
- Primary focus on mobile viewport ergonomics: bottom sheets for quick actions, sticky action bars, touch-friendly stepper inputs, and card layouts.
- Adaptive desktop viewports: multi-column dashboard, dense data tables, keyboard shortcuts.

### 4.2 Premium Visual Aesthetic & Usability
- High-grade visual design: tailored dark/light themes, subtle borders, soft shadows, purposeful micro-animations.
- Fast, intuitive, and clutter-free workflows for both admin and external clients.
- Clean RTL Persian typography (Vazirmatn or Shabnam font) with strict adherence to BiDi number/sign formatting rules.

---

## 5. Deployment & Technical Architecture

### 5.1 Infrastructure & Services
- **Hosting & Deployment:** **Vercel** (Serverless Next.js deployment).
- **Database:** **Neon** (Serverless PostgreSQL with connection pooling).
- **Application Framework:** Next.js (App Router, Server Actions, TypeScript).
- **ORM:** Prisma (configured to support Prisma 7 & Neon serverless pooled connection).

---

## 6. Implementation Roadmap
- [ ] **Phase 1: Project Setup & Neon / Prisma Configuration**
- [ ] **Phase 2: Database Schema & Migrations (Products, Clients, Links, Invoices, Orders)**
- [ ] **Phase 3: Admin Inventory Management & Excel Import/Export**
- [ ] **Phase 4: Dedicated Client Links & Mobile-First Catalog/Order Flow**
- [ ] **Phase 5: Proforma/Invoice Generation, PDF Export & Polish**
