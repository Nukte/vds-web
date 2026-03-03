import { createClient } from '@/utils/supabase/server';
import type { Database } from '@/database.types';

export type App = Database['public']['Tables']['apps']['Row'];
export type AppInsert = Database['public']['Tables']['apps']['Insert'];
export type AppUpdate = Database['public']['Tables']['apps']['Update'];

/**
 * Fetch all apps ordered by order_index ascending.
 * Public read — no auth required.
 */
export async function getApps(): Promise<App[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('[getApps]', error.message);
    return [];
  }

  return (data ?? []) as App[];
}

/**
 * Insert a new app record.
 * Requires an authenticated session.
 */
export async function createApp(
  payload: Omit<AppInsert, 'id' | 'created_at'>,
): Promise<App> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('apps')
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as App;
}

/**
 * Update an existing app record by id.
 * Requires an authenticated session.
 */
export async function updateApp(
  id: string,
  payload: Omit<AppUpdate, 'id' | 'created_at'>,
): Promise<App> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('apps')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as App;
}

/**
 * Delete an app record by id.
 * Requires an authenticated session.
 */
export async function deleteApp(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('apps').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Storage helpers ─────────────────────────────────────────────────────────

const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif']);
const ALLOWED_EXT  = new Set(['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif']);

/**
 * Upload an app icon to the `app-icons` storage bucket.
 * Validates MIME type and extension before uploading.
 */
export async function uploadAppIcon(file: File): Promise<string> {
  const ext = (file.name.split('.').pop() ?? '').toLowerCase();
  if (!ALLOWED_MIME.has(file.type) || !ALLOWED_EXT.has(ext)) {
    throw new Error('Desteklenmeyen dosya türü.');
  }
  const supabase = await createClient();
  const filePath = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from('app-icons')
    .upload(filePath, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('app-icons').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Remove an app icon from the `app-icons` storage bucket.
 * Parses the storage path from the full public URL.
 */
export async function removeAppIcon(iconUrl: string): Promise<void> {
  const marker = '/app-icons/';
  const idx = iconUrl.indexOf(marker);
  if (idx === -1) throw new Error(`Storage path parse failed for URL: ${iconUrl}`);
  const supabase = await createClient();
  await supabase.storage.from('app-icons').remove([iconUrl.substring(idx + marker.length)]);
}
