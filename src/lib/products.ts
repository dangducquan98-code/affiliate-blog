import type { SupabaseClient } from '@supabase/supabase-js';

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price_hint: string;
  affiliate_url: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductWritePayload = {
  slug: string;
  name: string;
  category: string;
  price_hint: string;
  affiliate_url: string | null;
  image: string | null;
};

function mapRow(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    category: String(row.category ?? ''),
    price_hint: String(row.price_hint ?? ''),
    affiliate_url:
      row.affiliate_url == null || row.affiliate_url === ''
        ? null
        : String(row.affiliate_url).trim(),
    image: row.image == null || row.image === '' ? null : String(row.image),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

/** True when PostgREST says relation/table is missing (migration not run yet). */
export function isMissingProductsTableError(message: string | null | undefined): boolean {
  if (!message) return false;
  const m = message.toLowerCase();
  return (
    m.includes('could not find the table') ||
    m.includes("relation \"public.products\" does not exist") ||
    m.includes('relation "products" does not exist') ||
    (m.includes('products') && m.includes('schema cache'))
  );
}

export function parseProductPayload(body: Record<string, unknown>): {
  data?: ProductWritePayload;
  error?: string;
} {
  const name = String(body.name || '').trim();
  const category = String(body.category || '').trim();
  let slug = String(body.slug || '').trim();
  const price_hint = String(body.price_hint || '').trim();
  const affiliateRaw = body.affiliate_url;
  const affiliate_url =
    affiliateRaw == null || String(affiliateRaw).trim() === ''
      ? null
      : String(affiliateRaw).trim();
  const imageRaw = body.image;
  const image =
    imageRaw == null || String(imageRaw).trim() === '' ? null : String(imageRaw).trim();

  if (!name) return { error: 'Thiếu tên sản phẩm.' };
  if (!slug) {
    slug = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }
  if (!slug) return { error: 'Thiếu slug.' };
  if (!category) return { error: 'Thiếu category.' };

  return {
    data: { slug, name, category, price_hint, affiliate_url, image },
  };
}

export async function listProductsAdmin(): Promise<{
  products: Product[];
  error: string | null;
  tableMissing: boolean;
}> {
  const { createServiceClient, isSupabaseServiceConfigured } = await import('./supabase');
  if (!isSupabaseServiceConfigured()) {
    return {
      products: [],
      error: 'Supabase service role chưa cấu hình.',
      tableMissing: false,
    };
  }
  const client = createServiceClient();
  if (!client) {
    return { products: [], error: 'Không tạo được service client.', tableMissing: false };
  }
  return fetchProductsWithClient(client);
}

export async function listProductsPublic(): Promise<{
  products: Product[];
  error: string | null;
  tableMissing: boolean;
}> {
  const { createAnonClient, isSupabaseConfigured } = await import('./supabase');
  if (!isSupabaseConfigured()) {
    return { products: [], error: null, tableMissing: false };
  }
  const client = createAnonClient();
  if (!client) {
    return { products: [], error: 'Không tạo được anon client.', tableMissing: false };
  }
  return fetchProductsWithClient(client);
}

async function fetchProductsWithClient(client: SupabaseClient): Promise<{
  products: Product[];
  error: string | null;
  tableMissing: boolean;
}> {
  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      if (isMissingProductsTableError(error.message)) {
        return {
          products: [],
          error:
            'Bảng products chưa tồn tại. Chạy migration supabase/migrations/20260826_products.sql.',
          tableMissing: true,
        };
      }
      return { products: [], error: error.message, tableMissing: false };
    }
    return {
      products: (data ?? []).map((row) => mapRow(row as Record<string, unknown>)),
      error: null,
      tableMissing: false,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi không xác định';
    if (isMissingProductsTableError(message)) {
      return {
        products: [],
        error: 'Bảng products chưa tồn tại. Chạy migration 20260826_products.sql.',
        tableMissing: true,
      };
    }
    return { products: [], error: message, tableMissing: false };
  }
}

export async function getProductByIdAdmin(
  id: string,
): Promise<{ product: Product | null; error: string | null; tableMissing: boolean }> {
  const { createServiceClient, isSupabaseServiceConfigured } = await import('./supabase');
  if (!isSupabaseServiceConfigured()) {
    return { product: null, error: 'Supabase service role chưa cấu hình.', tableMissing: false };
  }
  const client = createServiceClient();
  if (!client) {
    return { product: null, error: 'Không tạo được service client.', tableMissing: false };
  }

  try {
    const { data, error } = await client.from('products').select('*').eq('id', id).maybeSingle();
    if (error) {
      if (isMissingProductsTableError(error.message)) {
        return {
          product: null,
          error: 'Bảng products chưa tồn tại.',
          tableMissing: true,
        };
      }
      return { product: null, error: error.message, tableMissing: false };
    }
    if (!data) return { product: null, error: null, tableMissing: false };
    return {
      product: mapRow(data as Record<string, unknown>),
      error: null,
      tableMissing: false,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi không xác định';
    return {
      product: null,
      error: message,
      tableMissing: isMissingProductsTableError(message),
    };
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<{ product: Product | null; error: string | null; tableMissing: boolean }> {
  const { createAnonClient, isSupabaseConfigured } = await import('./supabase');
  if (!isSupabaseConfigured()) {
    return { product: null, error: null, tableMissing: false };
  }
  const client = createAnonClient();
  if (!client) {
    return { product: null, error: null, tableMissing: false };
  }

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      if (isMissingProductsTableError(error.message)) {
        return { product: null, error: null, tableMissing: true };
      }
      // Graceful: treat lookup errors as "no product" for /go fallback
      return { product: null, error: error.message, tableMissing: false };
    }
    if (!data) return { product: null, error: null, tableMissing: false };
    return {
      product: mapRow(data as Record<string, unknown>),
      error: null,
      tableMissing: false,
    };
  } catch {
    return { product: null, error: null, tableMissing: true };
  }
}

export async function getProductsBySlugs(slugs: string[]): Promise<{
  bySlug: Map<string, Product>;
  tableMissing: boolean;
}> {
  const unique = [...new Set(slugs.filter(Boolean))];
  const bySlug = new Map<string, Product>();
  if (unique.length === 0) {
    return { bySlug, tableMissing: false };
  }

  const { createAnonClient, isSupabaseConfigured } = await import('./supabase');
  if (!isSupabaseConfigured()) {
    return { bySlug, tableMissing: false };
  }
  const client = createAnonClient();
  if (!client) return { bySlug, tableMissing: false };

  try {
    const { data, error } = await client.from('products').select('*').in('slug', unique);
    if (error) {
      return { bySlug, tableMissing: isMissingProductsTableError(error.message) };
    }
    for (const row of data ?? []) {
      const product = mapRow(row as Record<string, unknown>);
      bySlug.set(product.slug, product);
    }
    return { bySlug, tableMissing: false };
  } catch {
    return { bySlug, tableMissing: true };
  }
}
