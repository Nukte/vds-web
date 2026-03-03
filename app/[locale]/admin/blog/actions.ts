'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import {
  createBlog,
  updateBlog,
  deleteBlog,
  upsertBlogTranslation,
  uploadBlogCoverImage,
  removeBlogCoverImage,
} from '@/services/blogs';

export type BlogFormState = {
  error: string | null;
  success: boolean;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  const map: Record<string, string> = {
    ş: 's', ı: 'i', ğ: 'g', ü: 'u', ö: 'o', ç: 'c',
    Ş: 's', İ: 'i', Ğ: 'g', Ü: 'u', Ö: 'o', Ç: 'c',
  };
  return text
    .split('')
    .map((c) => map[c] ?? c)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ── Zod Schema ───────────────────────────────────────────────────────────────

const BlogSchema = z.object({
  slug: z
    .string()
    .optional()
    .transform((val) => (val?.trim() === '' ? null : val?.trim() ?? null)),
  published_at: z
    .string()
    .optional()
    .transform((val) => (val?.trim() === '' ? null : val?.trim() ?? null)),
  title_tr: z.string().min(1, 'Türkçe başlık zorunludur.'),
  content_md_tr: z.string().min(1, 'Türkçe içerik zorunludur.'),
  title_en: z.string().min(1, 'İngilizce başlık zorunludur.'),
  content_md_en: z.string().min(1, 'İngilizce içerik zorunludur.'),
});

// ── Create ───────────────────────────────────────────────────────────────────

export async function createBlogAction(
  _prevState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized', success: false };

  const parsed = BlogSchema.safeParse({
    slug: formData.get('slug'),
    published_at: formData.get('published_at'),
    title_tr: formData.get('title_tr'),
    content_md_tr: formData.get('content_md_tr'),
    title_en: formData.get('title_en'),
    content_md_en: formData.get('content_md_en'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  const { slug, published_at, title_tr, content_md_tr, title_en, content_md_en } =
    parsed.data;

  const finalSlug = slug ?? slugify(title_tr);

  let coverImageUrl: string | null = null;
  const coverFile = formData.get('cover_image');
  if (coverFile instanceof File && coverFile.size > 0) {
    try {
      coverImageUrl = await uploadBlogCoverImage(coverFile);
    } catch (err) {
      return { error: (err as Error).message, success: false };
    }
  }

  try {
    const blog = await createBlog({
      slug: finalSlug,
      cover_image_url: coverImageUrl,
      published_at: published_at ?? null,
    });

    await Promise.all([
      upsertBlogTranslation(blog.id, 'tr', { title: title_tr, content_md: content_md_tr }),
      upsertBlogTranslation(blog.id, 'en', { title: title_en, content_md: content_md_en }),
    ]);
  } catch (err) {
    return { error: (err as Error).message, success: false };
  }

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  return { error: null, success: true };
}

// ── Update ───────────────────────────────────────────────────────────────────

export async function updateBlogAction(
  boundId: string,
  boundCurrentCoverUrl: string | null,
  _prevState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized', success: false };

  const parsed = BlogSchema.safeParse({
    slug: formData.get('slug'),
    published_at: formData.get('published_at'),
    title_tr: formData.get('title_tr'),
    content_md_tr: formData.get('content_md_tr'),
    title_en: formData.get('title_en'),
    content_md_en: formData.get('content_md_en'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  const { slug, published_at, title_tr, content_md_tr, title_en, content_md_en } =
    parsed.data;

  let coverImageUrl: string | null | undefined = undefined;
  const coverFile = formData.get('cover_image');
  if (coverFile instanceof File && coverFile.size > 0) {
    try {
      coverImageUrl = await uploadBlogCoverImage(coverFile);
      if (boundCurrentCoverUrl) {
        await removeBlogCoverImage(boundCurrentCoverUrl);
      }
    } catch (err) {
      return { error: (err as Error).message, success: false };
    }
  }

  try {
    const blogPayload =
      coverImageUrl !== undefined
        ? { slug: slug ?? undefined, cover_image_url: coverImageUrl, published_at: published_at ?? null }
        : { slug: slug ?? undefined, published_at: published_at ?? null };

    await updateBlog(boundId, blogPayload);

    await Promise.all([
      upsertBlogTranslation(boundId, 'tr', { title: title_tr, content_md: content_md_tr }),
      upsertBlogTranslation(boundId, 'en', { title: title_en, content_md: content_md_en }),
    ]);
  } catch (err) {
    return { error: (err as Error).message, success: false };
  }

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  return { error: null, success: true };
}

// ── Delete ───────────────────────────────────────────────────────────────────

export async function deleteBlogAction(
  boundId: string,
  boundCoverUrl: string | null,
  _prevState: BlogFormState,
  _formData: FormData,
): Promise<BlogFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized', success: false };

  try {
    if (boundCoverUrl) {
      await removeBlogCoverImage(boundCoverUrl);
    }
    await deleteBlog(boundId);
  } catch (err) {
    return { error: (err as Error).message, success: false };
  }

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  return { error: null, success: true };
}
