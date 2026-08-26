export type PostProduct = {
  name: string;
  priceHint: string;
  goSlug: string;
};

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

function normalizeProducts(value: unknown): PostProduct[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      const name = typeof row.name === 'string' ? row.name : '';
      const priceHint = typeof row.priceHint === 'string' ? row.priceHint : '';
      const goSlug = typeof row.goSlug === 'string' ? row.goSlug : '';
      if (!name || !goSlug) return null;
      return { name, priceHint, goSlug };
    })
    .filter((item): item is PostProduct => item !== null);
}

function mapRow(row: Record<string, unknown>): Post {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    content: String(row.content ?? ''),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    category: String(row.category ?? ''),
    cover_image: row.cover_image == null ? null : String(row.cover_image),
    products: normalizeProducts(row.products),
    published: Boolean(row.published),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function listPublishedPosts(limit?: number): Promise<PostsResult> {
  const { createAnonClient, isSupabaseConfigured } = await import('./supabase');
  if (!isSupabaseConfigured()) {
    return {
      posts: [],
      configured: false,
      error: 'Supabase chưa cấu hình (đang dùng placeholder). Điền SUPABASE_URL và SUPABASE_ANON_KEY thật để hiển thị bài viết.',
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

    if (typeof limit === 'number') {
      query = query.limit(limit);
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
