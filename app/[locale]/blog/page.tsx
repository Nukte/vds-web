import { getTranslations } from 'next-intl/server';
import { getPublishedBlogs } from '@/services/blogs';
import BlogPageContent from './_components/BlogPageContent';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return { title: t('title') };
}

export default async function BlogPage({ params }: Props) {
  await params; // locale consumed by client component via useLocale()
  const blogs = await getPublishedBlogs();
  return <BlogPageContent blogs={blogs} />;
}
