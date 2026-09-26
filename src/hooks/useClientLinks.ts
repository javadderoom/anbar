'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { CreateClientLinkInput } from '@/lib/validations';

export interface ClientLinkItem {
  id: string;
  token: string;
  clientName: string;
  phone?: string;
  createdDate: string;
  requestCount: number;
  isActive: boolean;
  expiresAt?: string;
}

// Fetch all client links
export function useClientLinks() {
  return useQuery<ClientLinkItem[]>({
    queryKey: queryKeys.links.all,
    queryFn: async () => {
      const res = await fetch('/api/links');
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'خطا در بارگذاری لینک‌های مشتریان');
      }
      return res.json();
    },
  });
}

// Create new client link mutation
export function useCreateClientLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateClientLinkInput) => {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'خطا در ایجاد لینک اختصاصی');
      }
      return data as ClientLinkItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.links.all });
    },
  });
}
