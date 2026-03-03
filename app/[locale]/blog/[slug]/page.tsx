import { notFound } from 'next/navigation';
import { getBlogBySlug } from '@/services/blogs';
import BlogPostContent from './_components/BlogPostContent';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// Always render dynamically — no static generation for blog posts
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};

  const translation =
    blog.blog_translations.find((t) => t.locale === locale) ??
    blog.blog_translations.find((t) => t.locale === 'tr');

  return { title: translation?.title ?? slug };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;

  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  // Prefer the active locale translation, fall back to Turkish
  const translation =
    blog.blog_translations.find((tr) => tr.locale === locale) ??
    blog.blog_translations.find((tr) => tr.locale === 'tr');

  if (!translation) notFound();

  return (
    <main>
      <BlogPostContent blog={blog} translation={translation} />
    </main>
  );
}
