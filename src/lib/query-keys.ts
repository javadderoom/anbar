export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (search?: string, category?: string) =>
      ['products', 'list', { search: search || '', category: category || '' }] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    movements: (productId: string) => ['products', productId, 'movements'] as const,
  },
  orders: {
    all: ['orders'] as const,
    pending: () => ['orders', 'pending'] as const,
  },
  links: {
    all: ['links'] as const,
    detail: (token: string) => ['links', 'detail', token] as const,
  },
};
