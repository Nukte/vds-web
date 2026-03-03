'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createBlogAction, updateBlogAction, type BlogFormState } from '../actions';
import type { BlogWithTranslations } from '@/services/blogs';
import type { BlogManagerLabels } from './BlogManager';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface BlogFormProps {
  blog?: BlogWithTranslations;
  labels: BlogManagerLabels;
  onCancel: () => void;
}

const initialState: BlogFormState = { error: null, success: false };

const textareaClass =
  'rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-shadow resize-y font-mono';

export default function BlogForm({ blog, labels, onCancel }: BlogFormProps) {
  const router = useRouter();

  const trTranslation = blog?.blog_translations.find((t) => t.locale === 'tr');
  const enTranslation = blog?.blog_translations.find((t) => t.locale === 'en');

  const action = blog
    ? updateBlogAction.bind(null, blog.id, blog.cover_image_url)
    : createBlogAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(labels.saveSuccess);
      router.refresh();
      onCancel();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Slug */}
      <Input
        id="slug"
        name="slug"
        type="text"
        label={`${labels.slug} (opsiyonel — boş bırakılırsa TR başlığından üretilir)`}
        defaultValue={blog?.slug ?? ''}
        placeholder="my-blog-post"
      />

      {/* Published at */}
      <Input
        id="published_at"
        name="published_at"
        type="date"
        label={`${labels.publishedAt} — boş bırakılırsa taslak olarak kaydedilir (sitede görünmez)`}
        defaultValue={
          blog?.published_at ? blog.published_at.split('T')[0] : ''
        }
      />

      {/* Cover image */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cover_image" className="text-sm font-medium text-foreground">
          {labels.coverImage}
        </label>
        {blog?.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.cover_image_url}
            alt="Mevcut kapak görseli"
            className="h-24 w-40 rounded object-cover border border-border"
          />
        )}
        <input
          id="cover_image"
          name="cover_image"
          type="file"
          accept="image/*"
          className="text-sm text-foreground file:mr-4 file:rounded-md file:border file:border-border file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-accent hover:file:text-accent-foreground file:transition-colors"
        />
      </div>

      <hr className="border-border" />

      {/* TR content */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-foreground uppercase tracking-wider">
          🇹🇷 Türkçe
        </legend>

        <Input
          id="title_tr"
          name="title_tr"
          type="text"
          required
          label={labels.titleTr}
          defaultValue={trTranslation?.title ?? ''}
          placeholder="Blog yazısı başlığı"
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="content_md_tr" className="text-sm font-medium text-foreground">
            {labels.contentTr}
          </label>
          <textarea
            id="content_md_tr"
            name="content_md_tr"
            rows={12}
            required
            defaultValue={trTranslation?.content_md ?? ''}
            placeholder="Markdown içeriği buraya yapıştırın…"
            className={textareaClass}
          />
        </div>
      </fieldset>

      <hr className="border-border" />

      {/* EN content */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-foreground uppercase tracking-wider">
          🇬🇧 English
        </legend>

        <Input
          id="title_en"
          name="title_en"
          type="text"
          required
          label={labels.titleEn}
          defaultValue={enTranslation?.title ?? ''}
          placeholder="Blog post title"
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="content_md_en" className="text-sm font-medium text-foreground">
            {labels.contentEn}
          </label>
          <textarea
            id="content_md_en"
            name="content_md_en"
            rows={12}
            required
            defaultValue={enTranslation?.content_md ?? ''}
            placeholder="Paste Markdown content here…"
            className={textareaClass}
          />
        </div>
      </fieldset>

      <div className="flex gap-2 pt-2">
        <Button type="submit" variant="primary" size="md" isLoading={isPending}>
          {isPending ? labels.saving : labels.save}
        </Button>
        <Button type="button" variant="ghost" size="md" onClick={onCancel}>
          {labels.cancel}
        </Button>
      </div>
    </form>
  );
}
