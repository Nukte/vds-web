import { createClient } from '@/utils/supabase/server';
import type { Database } from '@/database.types';

export type Blog = Database['public']['Tables']['blogs']['Row'];
export type BlogInsert = Database['public']['Tables']['blogs']['Insert'];
export type BlogUpdate = Database['public']['Tables']['blogs']['Update'];

export type BlogTranslation = Database['public']['Tables']['blog_translations']['Row'];
export type BlogTranslationInsert =
  Database['public']['Tables']['blog_translations']['Insert'];

export type BlogWithTranslations = Blog & {
  blog_translations: BlogTranslation[];
};

/**
 * Fetch all blogs with their TR translation for admin listing.
 * Ordered by created_at descending.
 */
export async function getBlogs(): Promise<BlogWithTranslations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blogs')
    .select('*, blog_translations(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getBlogs]', error.message);
    return [];
  }

  return (data as BlogWithTranslations[]) ?? [];
}

/**
 * Fetch a single blog by slug together with ALL its translations.
 * Returns null if not found.
 */
export async function getBlogBySlug(slug: string): Promise<BlogWithTranslations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blogs')
    .select('*, blog_translations(*)')
    .eq('slug', slug);

  if (error) {
    console.error('[getBlogBySlug]', error.message);
    return null;
  }

  return (data?.[0] as BlogWithTranslations) ?? null;
}

/**
 * Insert a new blog record.
 * Requires an authenticated session.
 */
export async function createBlog(
  payload: Omit<BlogInsert, 'id' | 'created_at'>,
): Promise<Blog> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blogs')
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Update an existing blog record by id.
 * Requires an authenticated session.
 */
export async function updateBlog(
  id: string,
  payload: Omit<BlogUpdate, 'id' | 'created_at'>,
): Promise<Blog> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blogs')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Delete a blog record by id (cascades to blog_translations).
 * Requires an authenticated session.
 */
export async function deleteBlog(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/**
 * Fetch all PUBLISHED blogs with translations for public-facing pages.
 * Filters out posts with null published_at or future dates.
 * Ordered by published_at descending.
 */
export async function getPublishedBlogs(): Promise<BlogWithTranslations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blogs')
    .select('*, blog_translations(*)')
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[getPublishedBlogs]', error.message);
    return [];
  }

  return (data as BlogWithTranslations[]) ?? [];
}

// ── Storage helpers ─────────────────────────────────────────────────────────

const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif']);
const ALLOWED_EXT  = new Set(['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif']);

/**
 * Upload a blog cover image to the `blog-images` storage bucket.
 * Validates MIME type and extension before uploading.
 */
export async function uploadBlogCoverImage(file: File): Promise<string> {
  const ext = (file.name.split('.').pop() ?? '').toLowerCase();
  if (!ALLOWED_MIME.has(file.type) || !ALLOWED_EXT.has(ext)) {
    throw new Error('Desteklenmeyen dosya türü.');
  }
  const supabase = await createClient();
  const filePath = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Remove a blog cover image from the `blog-images` storage bucket.
 * Parses the storage path from the full public URL.
 */
export async function removeBlogCoverImage(coverUrl: string): Promise<void> {
  const marker = '/blog-images/';
  const idx = coverUrl.indexOf(marker);
  if (idx === -1) throw new Error(`Storage path parse failed for URL: ${coverUrl}`);
  const supabase = await createClient();
  await supabase.storage.from('blog-images').remove([coverUrl.substring(idx + marker.length)]);
}

/**
 * Upsert a blog translation. If a row with (blog_id, locale) already exists
 * it will be updated; otherwise a new row is inserted.
 */
export async function upsertBlogTranslation(
  blog_id: string,
  locale: string,
  payload: { title: string; content_md: string },
): Promise<BlogTranslation> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_translations')
    .upsert({ blog_id, locale, ...payload }, { onConflict: 'blog_id,locale' })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
