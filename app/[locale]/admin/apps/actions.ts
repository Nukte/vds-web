'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { createApp, updateApp, deleteApp, uploadAppIcon, removeAppIcon } from '@/services/apps';

export type AppFormState = {
  error: string | null;
  success: boolean;
};

const AppSchema = z.object({
  name: z.string().min(1, 'Ad zorunludur.'),
  url: z.string().url('Geçerli bir URL giriniz.'),
  order_index: z.coerce.number().int().min(0).default(0),
});

// ── Create ──────────────────────────────────────────────────────────────────

export async function createAppAction(
  _prevState: AppFormState,
  formData: FormData,
): Promise<AppFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized', success: false };

  const parsed = AppSchema.safeParse({
    name: formData.get('name'),
    url: formData.get('url'),
    order_index: formData.get('order_index') || '0',
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  let iconUrl: string | null = null;
  const iconFile = formData.get('icon');
  if (iconFile instanceof File && iconFile.size > 0) {
    try {
      iconUrl = await uploadAppIcon(iconFile);
    } catch (err) {
      return { error: (err as Error).message, success: false };
    }
  }

  try {
    await createApp({ ...parsed.data, icon_url: iconUrl });
  } catch (err) {
    return { error: (err as Error).message, success: false };
  }

  revalidatePath('/uygulamalar');
  revalidatePath('/admin/apps');
  return { error: null, success: true };
}

// ── Update ──────────────────────────────────────────────────────────────────

export async function updateAppAction(
  boundId: string,
  boundCurrentIconUrl: string | null,
  _prevState: AppFormState,
  formData: FormData,
): Promise<AppFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized', success: false };

  const parsed = AppSchema.safeParse({
    name: formData.get('name'),
    url: formData.get('url'),
    order_index: formData.get('order_index') || '0',
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  let iconUrl: string | null | undefined = undefined; // undefined = don't change
  const iconFile = formData.get('icon');
  if (iconFile instanceof File && iconFile.size > 0) {
    try {
      iconUrl = await uploadAppIcon(iconFile);
      // Delete old icon after successful upload
      if (boundCurrentIconUrl) {
        await removeAppIcon(boundCurrentIconUrl);
      }
    } catch (err) {
      return { error: (err as Error).message, success: false };
    }
  }

  const payload =
    iconUrl !== undefined
      ? { ...parsed.data, icon_url: iconUrl }
      : { ...parsed.data };

  try {
    await updateApp(boundId, payload);
  } catch (err) {
    return { error: (err as Error).message, success: false };
  }

  revalidatePath('/uygulamalar');
  revalidatePath('/admin/apps');
  return { error: null, success: true };
}

// ── Delete ──────────────────────────────────────────────────────────────────

export async function deleteAppAction(
  boundId: string,
  boundIconUrl: string | null,
  _prevState: AppFormState,
  _formData: FormData,
): Promise<AppFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized', success: false };

  try {
    if (boundIconUrl) {
      await removeAppIcon(boundIconUrl);
    }
    await deleteApp(boundId);
  } catch (err) {
    return { error: (err as Error).message, success: false };
  }

  revalidatePath('/uygulamalar');
  revalidatePath('/admin/apps');
  return { error: null, success: true };
}
