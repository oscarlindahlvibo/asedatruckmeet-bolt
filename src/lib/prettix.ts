import type { ItemsResponse, CartResponse, CartLine } from '@/types';

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL ?? ''}/functions/v1/pretix-shop`;

export async function fetchTickets(): Promise<ItemsResponse> {
  const res = await fetch(`${FUNCTION_URL}?action=items`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Kunde inte hämta biljetter (${res.status})`);
  }
  return res.json();
}

export async function createCart(lines: CartLine[]): Promise<CartResponse> {
  const res = await fetch(`${FUNCTION_URL}?action=cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''}`,
    },
    body: JSON.stringify({ items: lines }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Kunde inte skapa varukorg: ${text || res.status}`);
  }
  return res.json();
}
