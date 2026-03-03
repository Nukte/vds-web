import { getTranslations } from 'next-intl/server';
import { getBlogs } from '@/services/blogs';
import BlogManager from './_components/BlogManager';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return { title: `${t('blog')} — ${t('adminPanel')}`, robots: { index: false, follow: false } };
}

export default async function AdminBlogPage({ params }: Props) {
  const { locale } = await params;
  const [t, blogs] = await Promise.all([
    getTranslations({ locale, namespace: 'admin' }),
    getBlogs(),
  ]);

  const labels = {
    addNew: t('addNew'),
    edit: t('edit'),
    delete: t('delete'),
    slug: t('blogSlug'),
    publishedAt: t('blogPublishedAt'),
    titleTr: t('blogTitleTr'),
    contentTr: t('blogContentTr'),
    titleEn: t('blogTitleEn'),
    contentEn: t('blogContentEn'),
    coverImage: t('blogCoverImage'),
    save: t('save'),
    saving: t('saving'),
    cancel: t('cancel'),
    confirmDelete: t('confirmDeleteBlog'),
    saveSuccess: t('blogSaveSuccess'),
    deleteSuccess: t('blogDeleteSuccess'),
  };

  return (
    <section>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">{t('blog')}</h1>
      </header>
      <BlogManager blogs={blogs} labels={labels} />
    </section>
  );
}
