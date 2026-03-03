import { createClient } from '@/utils/supabase/server';
import type { Database } from '@/database.types';

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

/**
 * Fetch all projects ordered by order_index ascending.
 * Public read — no auth required.
 */
export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('[getProjects]', error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Insert a new project record.
 * Requires an authenticated session.
 */
export async function createProject(
  payload: Omit<ProjectInsert, 'id' | 'created_at'>,
): Promise<Project> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Update an existing project record by id.
 * Requires an authenticated session.
 */
export async function updateProject(
  id: string,
  payload: Omit<ProjectUpdate, 'id' | 'created_at'>,
): Promise<Project> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Delete a project record by id.
 * Requires an authenticated session.
 */
export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
