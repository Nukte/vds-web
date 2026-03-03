'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import type { BlogWithTranslations } from '@/services/blogs';

/*
 * Aesthetic: "Nordic Editorial / Broadsheet"
 * ─────────────────────────────────────────
 * Spare typographic hierarchy inspired by high-end literary journals.
 * Massive italic masthead, metadata strip, horizontal rule separators,
 * hover underline-draw animations, and a fragmented layout rhythm.
 */

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateShort(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'short',
  });
}

function getTranslation(blog: BlogWithTranslations, locale: string) {
  return (
    blog.blog_translations.find((tr) => tr.locale === locale) ??
    blog.blog_translations.find((tr) => tr.locale === 'tr')
  );
}

// ── Decorative horizontal rule ─────────────────────────────────────────────
function Rule({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className="h-px origin-left"
      style={{
        background:
          'repeating-linear-gradient(to right, var(--border) 0px, var(--border) 4px, transparent 4px, transparent 8px)',
      }}
    />
  );
}

// ── Featured post ─────────────────────────────────────────────────────────
function FeaturedPost({
  blog,
  readMoreLabel,
  index,
}: {
  blog: BlogWithTranslations;
  readMoreLabel: string;
  index: number;
}) {
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const translation = getTranslation(blog, locale);
  if (!translation) return null;

  const date = blog.published_at ? formatDate(blog.published_at, locale) : null;
  const ordinal = String(index + 1).padStart(2, '0');
  const excerpt = translation.content_md
    ? translation.content_md.replace(/[#*`>\[\]()!]/g, '').slice(0, 160).trim() + '…'
    : null;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/blog/${blog.slug}`} className="group block">
        <div className="flex flex-col gap-6 py-8 sm:py-10 lg:flex-row lg:items-start lg:gap-12">

          {/* Left: ordinal + date */}
          <div className="flex shrink-0 items-center gap-4 lg:w-40 lg:flex-col lg:items-start lg:gap-3 lg:pt-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              №&nbsp;{ordinal}
            </span>
            {date && (
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                {date}
              </span>
            )}
          </div>

          {/* Center: image + title */}
          <div className="flex-1 min-w-0">
            {blog.cover_image_url && (
              <div className="relative mb-5 overflow-hidden aspect-[16/7]">
                <Image
                  src={blog.cover_image_url}
                  alt={translation.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 90vw, 720px"
                  priority
                />
                {/* Ink vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              </div>
            )}

            {/* Title with underline-draw on hover */}
            <div className="relative inline-block max-w-3xl">
              <h2 className="font-display text-3xl font-light italic leading-tight tracking-[-0.02em] text-foreground transition-colors duration-300 group-hover:text-accent sm:text-4xl lg:text-5xl">
                {translation.title}
              </h2>
              {/* Underline draws from left */}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />
            </div>

            {/* Excerpt */}
            {excerpt && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {excerpt}
              </p>
            )}

            {/* Read more */}
            <p className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent transition-colors duration-200 group-hover:text-foreground">
              {readMoreLabel}
              <span className="block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// ── Compact post ─────────────────────────────────────────────────────────────
function CompactPost({
  blog,
  index,
  readMoreLabel,
}: {
  blog: BlogWithTranslations;
  index: number;
  readMoreLabel: string;
}) {
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-24px' });

  const translation = getTranslation(blog, locale);
  if (!translation) return null;

  const date = blog.published_at ? formatDateShort(blog.published_at, locale) : null;
  const ordinal = String(index + 1).padStart(2, '0');
  const excerpt = translation.content_md
    ? translation.content_md.replace(/[#*`>\[\]()!]/g, '').slice(0, 120).trim() + '…'
    : null;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, x: 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 6) * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/blog/${blog.slug}`} className="group block">
        <div className="flex items-start gap-5 py-7 sm:gap-8 sm:py-8">

          {/* Ordinal */}
          <span className="hidden shrink-0 w-8 pt-1 text-right font-mono text-[11px] text-muted-foreground/40 transition-colors duration-200 group-hover:text-accent sm:block">
            {ordinal}
          </span>

          {/* Thumbnail — only if exists */}
          {blog.cover_image_url && (
            <div className="relative w-20 h-20 shrink-0 overflow-hidden sm:w-24 sm:h-24">
              <Image
                src={blog.cover_image_url}
                alt={translation.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="96px"
              />
            </div>
          )}

          {/* Body */}
          <div className="flex-1 min-w-0">
            <div className="relative inline-block max-w-xl">
              <h2 className="font-display text-xl font-light italic leading-snug text-foreground transition-colors duration-200 group-hover:text-accent sm:text-2xl">
                {translation.title}
              </h2>
              {/* Underline draw */}
              <span
                aria-hidden
                className="absolute -bottom-0.5 left-0 block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />
            </div>

            {excerpt && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {excerpt}
              </p>
            )}

            <div className="mt-3 flex items-center gap-4">
              {date && (
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
                  {date}
                </span>
              )}
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent/0 transition-all duration-300 group-hover:text-accent group-hover:translate-x-1">
                {readMoreLabel} →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function BlogPageContent({ blogs }: { blogs: BlogWithTranslations[] }) {
  const t = useTranslations('blog');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const [featured, ...rest] = blogs;

  // Current "issue" date — publication's running date stamp
  const issueDate = new Date().toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <main className="relative overflow-hidden">
      {/* ── Masthead ─────────────────────────────────────────────── */}
      <header className="relative px-6 pt-20 pb-0 sm:px-10 sm:pt-28 lg:px-16 lg:pt-32">
        {/* Subtle radial wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_20%_0%,var(--accent)/0.05,transparent)]"
        />

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-accent"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
            {tCommon('backToHome')}
          </Link>
        </motion.div>

        {/* Masthead top rule */}
        <Rule delay={0.1} />

        {/* Publication metadata strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-between py-3"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/60">
            {issueDate}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/60">
            {String(blogs.length).padStart(2, '0')}&nbsp;{t('title').toLowerCase()}
          </span>
        </motion.div>

        {/* Masthead bottom rule */}
        <Rule delay={0.15} />

        {/* Giant masthead title */}
        <div className="relative overflow-hidden py-4 sm:py-6">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(4rem,14vw,10rem)] font-light italic leading-[0.85] tracking-[-0.03em] text-foreground"
          >
            {t('title')}
          </motion.h1>

          {/* Ghost ordinal bleeding off the right */}
          <motion.span
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="pointer-events-none absolute -right-2 bottom-2 select-none font-mono text-[5rem] font-bold leading-none text-accent/[0.06] sm:text-[7rem] lg:text-[9rem]"
          >
            {String(blogs.length).padStart(2, '0')}
          </motion.span>
        </div>

        {/* Description subline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="pb-8 font-sans text-sm text-muted-foreground sm:text-base"
        >
          {t('description')}
        </motion.p>

        {/* Heavy bottom rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="h-[3px] origin-left bg-foreground/90"
        />
      </header>

      {/* ── Content ──────────────────────────────────────────────── */}
      <section
        aria-label={t('title')}
        className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 sm:pb-32 lg:px-16"
      >
        {blogs.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-12 font-mono text-sm uppercase tracking-[0.18em] text-muted-foreground"
          >
            {t('empty')}
          </motion.p>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <>
                <FeaturedPost
                  blog={featured}
                  readMoreLabel={t('readMore')}
                  index={0}
                />
                <Rule delay={0} />
              </>
            )}

            {/* Remaining posts */}
            {rest.map((blog, i) => (
              <div key={blog.id}>
                <CompactPost
                  blog={blog}
                  index={i + 1}
                  readMoreLabel={t('readMore')}
                />
                <Rule delay={0} />
              </div>
            ))}
          </>
        )}
      </section>
    </main>
  );
}
