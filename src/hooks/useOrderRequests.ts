'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { CreateOrderRequestInput, ConvertOrderRequestInput } from '@/lib/validations';

export interface OrderRequestItem {
  id: string;
  orderNumber: string;
  clientName: string;
  phone: string;
  itemsCount: number;
  totalEstimate: number;
  status: 'PENDING' | 'CONVERTED' | 'REJECTED';
  date: string;
  notes?: string;
  items: {
    id: string;
    productId: string;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
  }[];
}

// Fetch all order requests with background polling
export function useOrderRequests(options?: { refetchInterval?: number | false }) {
  return useQuery<OrderRequestItem[]>({
    queryKey: queryKeys.orders.all,
    queryFn: async () => {
      const res = await fetch('/api/requests');
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'خطا در دریافت درخواست‌های استعلام');
      }
      return res.json();
    },
    refetchInterval: options?.refetchInterval ?? 15000, // 15s liveness polling for new client quotes
    refetchIntervalInBackground: false,
  });
}

// Submit new order request from customer catalog
export function useSubmitOrderRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrderRequestInput) => {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'خطا در ثبت سفارش');
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

// Convert order request to official invoice (with stock decrement)
export function useConvertOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data = { deductStock: true, invoiceType: 'SALES' },
    }: {
      id: string;
      data?: ConvertOrderRequestInput;
    }) => {
      const res = await fetch(`/api/requests/${id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || resData.error || 'خطا در تبدیل سفارش به فاکتور');
      }
      return resData;
    },
    onSuccess: () => {
      // Invalidate both orders and products caches
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
