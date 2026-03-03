import { getTranslations } from 'next-intl/server';
import { getProjects } from '@/services/projects';
import { getPublishedBlogs } from '@/services/blogs';
import HeroSection from '@/components/home/HeroSection';
import ProjectsShowcase from '@/components/home/ProjectsShowcase';
import BlogShowcase from '@/components/home/BlogShowcase';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  const [t, projects, blogs] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getProjects(),
    getPublishedBlogs(),
  ]);

  const featuredProjects = projects.slice(0, 4);
  const latestBlogs = blogs.slice(0, 5);

  return (
    <div className="relative">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <HeroSection
        description={t('hero.description')}
        scrollHint={t('scrollHint')}
        wit={t('hero.wit')}
        serious={t('hero.serious')}
      />

      {/* ── Gold divider between sections ─────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </div>

      {/* ── Projects ──────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl py-24 sm:py-32">
        <ProjectsShowcase
          projects={featuredProjects}
          title={t('projects.title')}
          viewAllLabel={t('projects.viewAll')}
          visitSiteLabel={t('projects.visitSite')}
          viewCodeLabel={t('projects.viewCode')}
          viewAllHref={`/${locale}/projeler`}
        />
      </div>

      {/* ── Gold divider ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </div>

      {/* ── Blog ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl py-24 sm:py-32">
        <BlogShowcase
          blogs={latestBlogs}
          locale={locale}
          title={t('blog.title')}
          viewAllLabel={t('blog.viewAll')}
          readMoreLabel={t('blog.readMore')}
          viewAllHref={`/${locale}/blog`}
        />
      </div>
    </div>
  );
}

