export type {
  PostProduct,
  PostProductLegacy,
  PostProductRef,
  DisplayProduct,
} from './admin-posts';
export { productSlugOf, isLegacyProduct, resolveDisplayProducts } from './admin-posts';

import type { PostProduct } from './admin-posts';
import { normalizeStoredProducts, resolveDisplayProducts } from './admin-posts';
import { getProductsBySlugs } from './products';

export type Post = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  cover_image: string | null;
  products: PostProduct[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type PostsResult = {
  posts: Post[];
  configured: boolean;
  error: string | null;
};

function mapRow(row: Record<string, unknown>): Post {
  const productsRaw = Array.isArray(row.products) ? row.products : [];
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    content: String(row.content ?? ''),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    category: String(row.category ?? ''),
    cover_image: row.cover_image == null ? null : String(row.cover_image),
    products: normalizeStoredProducts(productsRaw),
    published: Boolean(row.published),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

async function queryPublishedPosts(options?: {
  limit?: number;
  category?: string;
}): Promise<PostsResult> {
  const { createAnonClient, isSupabaseConfigured } = await import('./supabase');
  if (!isSupabaseConfigured()) {
    return {
      posts: [],
      configured: false,
      error:
        'Supabase chưa cấu hình (đang dùng placeholder). Điền SUPABASE_URL và SUPABASE_ANON_KEY thật để hiển thị bài viết.',
    };
  }

  const client = createAnonClient();
  if (!client) {
    return { posts: [], configured: false, error: 'Không tạo được Supabase client.' };
  }

  try {
    let query = client
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    if (typeof options?.limit === 'number') {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) {
      return {
        posts: [],
        configured: true,
        error: `Không tải được bài viết: ${error.message}`,
      };
    }

    return {
      posts: (data ?? []).map((row) => mapRow(row as Record<string, unknown>)),
      configured: true,
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi không xác định';
    return { posts: [], configured: true, error: `Không tải được bài viết: ${message}` };
  }
}

export async function listPublishedPosts(limit?: number): Promise<PostsResult> {
  return queryPublishedPosts({ limit });
}

export async function listPublishedPostsByCategory(
  category: string,
  limit?: number,
): Promise<PostsResult> {
  return queryPublishedPosts({ category, limit });
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<{ post: Post | null; configured: boolean; error: string | null }> {
  const { createAnonClient, isSupabaseConfigured } = await import('./supabase');
  if (!isSupabaseConfigured()) {
    return {
      post: null,
      configured: false,
      error: 'Supabase chưa cấu hình (đang dùng placeholder).',
    };
  }

  const client = createAnonClient();
  if (!client) {
    return { post: null, configured: false, error: 'Không tạo được Supabase client.' };
  }

  try {
    const { data, error } = await client
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      return { post: null, configured: true, error: error.message };
    }
    if (!data) {
      return { post: null, configured: true, error: null };
    }
    return {
      post: mapRow(data as Record<string, unknown>),
      configured: true,
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi không xác định';
    return { post: null, configured: true, error: message };
  }
}

export async function listAllPostsAdmin(): Promise<{ posts: Post[]; error: string | null }> {
  const { createServiceClient, isSupabaseServiceConfigured } = await import('./supabase');
  if (!isSupabaseServiceConfigured()) {
    return {
      posts: [],
      error: 'Supabase service role chưa cấu hình. Điền SUPABASE_SERVICE_ROLE_KEY thật.',
    };
  }

  const client = createServiceClient();
  if (!client) {
    return { posts: [], error: 'Không tạo được service client.' };
  }

  const { data, error } = await client
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    return { posts: [], error: error.message };
  }

  return {
    posts: (data ?? []).map((row) => mapRow(row as Record<string, unknown>)),
    error: null,
  };
}

export async function getPostByIdAdmin(
  id: string,
): Promise<{ post: Post | null; error: string | null }> {
  const { createServiceClient, isSupabaseServiceConfigured } = await import('./supabase');
  if (!isSupabaseServiceConfigured()) {
    return { post: null, error: 'Supabase service role chưa cấu hình.' };
  }

  const client = createServiceClient();
  if (!client) {
    return { post: null, error: 'Không tạo được service client.' };
  }

  const { data, error } = await client.from('posts').select('*').eq('id', id).maybeSingle();
  if (error) return { post: null, error: error.message };
  if (!data) return { post: null, error: null };
  return { post: mapRow(data as Record<string, unknown>), error: null };
}

/** Resolve post.products (slug refs + legacy) into display rows for blog UI. */
export async function hydratePostProducts(post: Post) {
  const { productSlugOf } = await import('./admin-posts');
  const slugs = post.products.map(productSlugOf).filter(Boolean);
  const { bySlug } = await getProductsBySlugs(slugs);
  return resolveDisplayProducts(post.products, bySlug);
}
