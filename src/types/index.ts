export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  specifications?: Record<string, string | number>;
  unit: string;
  unitPrice: number;
  stockQuantity: number;
  minStockAlert: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Client {
  id: string;
  name: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  isGuest: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientLink {
  id: string;
  token: string;
  label?: string;
  clientId?: string;
  client?: Client;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  requestCount?: number;
}

export type OrderStatus = 'PENDING' | 'REVIEWED' | 'CONVERTED' | 'REJECTED';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

export interface OrderRequest {
  id: string;
  orderNumber: string;
  linkId?: string;
  clientId?: string;
  clientName?: string;
  clientPhone?: string;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

export type InvoiceType = 'PROFORMA' | 'SALES';
export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';

export interface InvoiceItem {
  id: string;
  productId?: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  status: InvoiceStatus;
  clientId?: string;
  client?: Client;
  orderRequestId?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  issuedDate: string;
  dueDate?: string;
  terms?: string;
  notes?: string;
  items: InvoiceItem[];
}

export type StockMovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface StockMovement {
  id: string;
  productId: string;
  type: StockMovementType;
  deltaQuantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  referenceId?: string;
  userName?: string;
  createdAt: string;
}

