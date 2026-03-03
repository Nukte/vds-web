'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { createProject, updateProject, deleteProject } from '@/services/projects';

export type ProjectFormState = {
  error: string | null;
  success: boolean;
};

const ProjectSchema = z.object({
  title: z.string().min(1, 'Başlık zorunludur.'),
  description: z
    .string()
    .optional()
    .transform((val) => (val?.trim() === '' ? null : (val ?? null))),
  tags: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    ),
  github_url: z
    .string()
    .optional()
    .transform((val) => (val?.trim() === '' ? null : (val ?? null))),
  live_url: z
    .string()
    .optional()
    .transform((val) => (val?.trim() === '' ? null : (val ?? null))),
  order_index: z.coerce.number().int().min(0).default(0),
});

// Create
export async function createProjectAction(
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized', success: false };

  const parsed = ProjectSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    tags: formData.get('tags'),
    github_url: formData.get('github_url'),
    live_url: formData.get('live_url'),
    order_index: formData.get('order_index') || '0',
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  try {
    await createProject(parsed.data);
  } catch (err) {
    return { error: (err as Error).message, success: false };
  }

  revalidatePath('/projeler');
  revalidatePath('/admin/projects');
  return { error: null, success: true };
}

// Update
export async function updateProjectAction(
  boundId: string,
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized', success: false };

  const parsed = ProjectSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    tags: formData.get('tags'),
    github_url: formData.get('github_url'),
    live_url: formData.get('live_url'),
    order_index: formData.get('order_index') || '0',
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  try {
    await updateProject(boundId, parsed.data);
  } catch (err) {
    return { error: (err as Error).message, success: false };
  }

  revalidatePath('/projeler');
  revalidatePath('/admin/projects');
  return { error: null, success: true };
}

// Delete
export async function deleteProjectAction(
  boundId: string,
  _prevState: ProjectFormState,
  _formData: FormData,
): Promise<ProjectFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized', success: false };

  try {
    await deleteProject(boundId);
  } catch (err) {
    return { error: (err as Error).message, success: false };
  }

  revalidatePath('/projeler');
  revalidatePath('/admin/projects');
  return { error: null, success: true };
}
