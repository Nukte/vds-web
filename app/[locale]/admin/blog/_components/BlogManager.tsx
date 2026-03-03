'use client';

import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { BlogWithTranslations } from '@/services/blogs';
import { deleteBlogAction, type BlogFormState } from '../actions';
import BlogForm from './BlogForm';
import Button from '@/components/ui/Button';

export interface BlogManagerLabels {
  addNew: string;
  edit: string;
  delete: string;
  slug: string;
  publishedAt: string;
  titleTr: string;
  contentTr: string;
  titleEn: string;
  contentEn: string;
  coverImage: string;
  save: string;
  saving: string;
  cancel: string;
  confirmDelete: string;
  saveSuccess: string;
  deleteSuccess: string;
}

interface BlogManagerProps {
  blogs: BlogWithTranslations[];
  labels: BlogManagerLabels;
}

const deleteInitialState: BlogFormState = { error: null, success: false };

function DeleteButton({
  blog,
  labels,
}: {
  blog: BlogWithTranslations;
  labels: BlogManagerLabels;
}) {
  const router = useRouter();
  const boundAction = deleteBlogAction.bind(null, blog.id, blog.cover_image_url);
  const [state, formAction, isPending] = useActionState(boundAction, deleteInitialState);

  useEffect(() => {
    if (state.success) {
      toast.success(labels.deleteSuccess);
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm(labels.confirmDelete)) {
      e.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <Button type="submit" variant="destructive" size="sm" isLoading={isPending}>
        {labels.delete}
      </Button>
    </form>
  );
}

export default function BlogManager({ blogs, labels }: BlogManagerProps) {
  const [editingBlog, setEditingBlog] = useState<BlogWithTranslations | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  function handleCloseForm() {
    setEditingBlog(null);
    setShowAddForm(false);
  }

  const isFormOpen = showAddForm || editingBlog !== null;

  return (
    <div className="flex flex-col gap-6">
      {!isFormOpen && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setShowAddForm(true)}
          >
            {labels.addNew}
          </Button>
        </div>
      )}

      {showAddForm && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            {labels.addNew}
          </h2>
          <BlogForm labels={labels} onCancel={handleCloseForm} />
        </div>
      )}

      {editingBlog && (
        <div className="rounded-lg border border-accent bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            {labels.edit}: {editingBlog.blog_translations.find((t) => t.locale === 'tr')?.title ?? editingBlog.slug}
          </h2>
          <BlogForm blog={editingBlog} labels={labels} onCancel={handleCloseForm} />
        </div>
      )}

      {blogs.length === 0 ? (
        <p className="text-muted-foreground text-sm">Henüz blog yazısı eklenmedi.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {blogs.map((blog) => {
            const trTitle = blog.blog_translations.find((t) => t.locale === 'tr')?.title;
            return (
              <li
                key={blog.id}
                className="flex items-start gap-4 rounded-lg border border-border bg-card px-4 py-3 shadow-sm"
              >
                {blog.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={blog.cover_image_url}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground truncate">
                      {trTitle ?? blog.slug}
                    </p>
                    {blog.published_at && new Date(blog.published_at) <= new Date() ? (
                      <span className="shrink-0 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-green-500/15 text-green-600 dark:text-green-400">
                        Yayında
                      </span>
                    ) : (
                      <span className="shrink-0 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-yellow-500/15 text-yellow-600 dark:text-yellow-400">
                        Taslak
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
                    /{blog.slug}
                  </p>
                  {blog.published_at && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(blog.published_at).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingBlog(blog);
                    }}
                  >
                    {labels.edit}
                  </Button>
                  <DeleteButton blog={blog} labels={labels} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
