'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'motion/react';
import AnimatedSection from './AnimatedSection';

interface BlogTranslation {
  id: string;
  blog_id: string;
  locale: string;
  title: string;
  content_md: string;
}

interface Blog {
  id: string;
  slug: string;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
  blog_translations: BlogTranslation[];
}

interface BlogShowcaseProps {
  blogs: Blog[];
  locale: string;
  title: string;
  viewAllLabel: string;
  readMoreLabel: string;
  viewAllHref: string;
}

function formatDate(dateStr: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr));
}

function getTranslation(blog: Blog, locale: string): BlogTranslation | null {
  return (
    blog.blog_translations.find((t) => t.locale === locale) ??
    blog.blog_translations.find((t) => t.locale === 'tr') ??
    null
  );
}

function FeaturedPost({
  blog,
  locale,
  readMoreLabel,
  blogHref,
}: {
  blog: Blog;
  locale: string;
  readMoreLabel: string;
  blogHref: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const translation = getTranslation(blog, locale);
  if (!translation) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
      transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <a
        href={blogHref}
        className="group relative block overflow-hidden rounded-sm"
      >
        {blog.cover_image_url ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[3/4]">
            <Image
              src={blog.cover_image_url}
              alt={translation.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
            {/* Content overlay */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 sm:p-8">
              {blog.published_at && (
                <time
                  dateTime={blog.published_at}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60"
                >
                  {formatDate(blog.published_at, locale)}
                </time>
              )}
              <h3 className="font-display text-2xl font-medium leading-tight text-foreground transition-colors group-hover:text-accent sm:text-3xl lg:text-4xl">
                {translation.title}
              </h3>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-accent transition-transform group-hover:translate-x-1">
                {readMoreLabel}
                <span aria-hidden>→</span>
              </span>
            </div>
          </div>
        ) : (
          /* No cover image — typographic treatment */
          <div className="relative flex aspect-[4/3] flex-col justify-end bg-accent/[0.06] p-6 transition-colors group-hover:bg-accent/[0.1] sm:p-8 lg:aspect-[3/4]">
            {/* Large decorative quote mark */}
            <span
              aria-hidden
              className="pointer-events-none absolute right-6 top-6 select-none font-display text-[8rem] leading-none text-accent/[0.08]"
            >
              &ldquo;
            </span>
            {blog.published_at && (
              <time
                dateTime={blog.published_at}
                className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                {formatDate(blog.published_at, locale)}
              </time>
            )}
            <h3 className="font-display text-2xl font-medium leading-tight text-foreground transition-colors group-hover:text-accent sm:text-3xl lg:text-4xl">
              {translation.title}
            </h3>
            <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-accent transition-transform group-hover:translate-x-1">
              {readMoreLabel}
              <span aria-hidden>→</span>
            </span>
          </div>
        )}
      </a>
    </motion.div>
  );
}

function CompactPost({
  blog,
  locale,
  index,
  blogHref,
}: {
  blog: Blog;
  locale: string;
  index: number;
  blogHref: string;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const translation = getTranslation(blog, locale);
  if (!translation) return null;

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className="group border-b border-border/40 last:border-b-0"
    >
      <a
        href={blogHref}
        className="flex items-start gap-4 py-5 transition-colors sm:py-6"
      >
        {/* Tiny index */}
        <span className="mt-1 shrink-0 font-mono text-sm text-accent/40">
          {String(index + 2).padStart(2, '0')}
        </span>

        <div className="flex-1">
          <h3 className="font-display text-base font-medium text-foreground transition-all duration-300 group-hover:text-accent group-hover:translate-x-1 sm:text-lg">
            {translation.title}
          </h3>
          {blog.published_at && (
            <time
              dateTime={blog.published_at}
              className="mt-1 block font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70"
            >
              {formatDate(blog.published_at, locale)}
            </time>
          )}
        </div>

        {/* Arrow */}
        <span
          aria-hidden
          className="mt-1 shrink-0 text-accent/0 transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5"
        >
          →
        </span>
      </a>
    </motion.li>
  );
}

export default function BlogShowcase({
  blogs,
  locale,
  title,
  viewAllLabel,
  readMoreLabel,
  viewAllHref,
}: BlogShowcaseProps) {
  if (blogs.length === 0) return null;

  const [featured, ...rest] = blogs;

  return (
    <section aria-labelledby="blog-heading" className="relative px-6 sm:px-10 lg:px-16">
      {/* ── Decorative index ─────────────────────────────────────── */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-6 select-none font-mono text-[7rem] leading-none text-accent/[0.05] sm:-right-4 sm:text-[10rem]"
      >
        03
      </span>

      {/* ── Section Header ───────────────────────────────────────── */}
      <AnimatedSection className="mb-10 sm:mb-14">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="blog-heading"
            className="font-display text-3xl font-light tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {title}
          </h2>
          <a
            href={viewAllHref}
            className="group/all mb-1 hidden items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent sm:inline-flex"
          >
            <span>{viewAllLabel}</span>
            <span className="inline-block transition-transform group-hover/all:translate-x-1">
              →
            </span>
          </a>
        </div>
        <div className="mt-4 h-px w-full bg-gradient-to-r from-border via-border/50 to-transparent" />
      </AnimatedSection>

      {/* ── Magazine Layout ──────────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
        {/* Featured post */}
        <FeaturedPost
          blog={featured}
          locale={locale}
          readMoreLabel={readMoreLabel}
          blogHref={`/${locale}/blog/${featured.slug}`}
        />

        {/* Compact list of remaining posts */}
        {rest.length > 0 && (
          <div className="flex flex-col justify-between">
            <ul>
              {rest.map((blog, i) => (
                <CompactPost
                  key={blog.id}
                  blog={blog}
                  locale={locale}
                  index={i}
                  blogHref={`/${locale}/blog/${blog.slug}`}
                />
              ))}
            </ul>

            {/* Desktop view all — inside the right column */}
            <AnimatedSection delay={0.3} className="mt-6 hidden lg:block">
              <a
                href={viewAllHref}
                className="group/all inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
              >
                <span>{viewAllLabel}</span>
                <span className="inline-block transition-transform group-hover/all:translate-x-1">
                  →
                </span>
              </a>
            </AnimatedSection>
          </div>
        )}
      </div>

      {/* ── Mobile view all ──────────────────────────────────────── */}
      <AnimatedSection delay={0.2} className="mt-8 sm:hidden">
        <a
          href={viewAllHref}
          className="group/all inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
        >
          <span>{viewAllLabel}</span>
          <span className="inline-block transition-transform group-hover/all:translate-x-1">
            →
          </span>
        </a>
      </AnimatedSection>
    </section>
  );
}
