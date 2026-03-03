'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import type { BlogWithTranslations } from '@/services/blogs';

const EASE = [0.25, 0.4, 0.25, 1] as const;

interface Props {
  blog: BlogWithTranslations;
  translation: { title: string; content_md: string };
}

export default function BlogPostContent({ blog, translation }: Props) {
  const t = useTranslations('blog');
  const locale = useLocale();

  const formattedDate = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="relative overflow-x-hidden">
      {/* ── Back link ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 sm:pt-14"
      >
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-200"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
          {t('backToBlog')}
        </Link>
      </motion.div>

      {/* ── Article header ─────────────────────────────────────────────────── */}
      {blog.cover_image_url ? (
        // With cover image — editorial overlay style
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="mt-8 max-w-6xl mx-auto px-6 sm:px-10 lg:px-16"
        >
          <div className="relative overflow-hidden rounded-sm aspect-[4/3] sm:aspect-[16/8] lg:aspect-[16/7]">
            <Image
              src={blog.cover_image_url}
              alt={translation.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />

            {/* Title + date overlaid */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              {formattedDate && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted-foreground/80 mb-4"
                >
                  {t('publishedAt', { date: formattedDate })}
                </motion.p>
              )}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
                className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight tracking-[-0.025em] max-w-3xl"
              >
                {translation.title}
              </motion.h1>
            </div>
          </div>
        </motion.div>
      ) : (
        // No cover image — decorative header block
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="mt-8 max-w-6xl mx-auto px-6 sm:px-10 lg:px-16"
        >
          <div className="relative bg-accent/[0.055] rounded-sm px-8 sm:px-12 lg:px-16 py-12 sm:py-16 overflow-hidden">
            {/* Decorative section index */}
            <span
              aria-hidden
              className="pointer-events-none select-none absolute -top-4 right-6 sm:right-10 font-mono font-bold
                         text-[7rem] sm:text-[10rem] lg:text-[13rem] leading-none text-accent/[0.07] z-0"
            >
              ¶
            </span>
            {/* Decorative quote */}
            <span
              aria-hidden
              className="absolute bottom-2 right-8 font-display text-[6rem] sm:text-[9rem] leading-none text-accent/[0.06] select-none pointer-events-none"
            >
              &rdquo;
            </span>

            <div className="relative z-10">
              {formattedDate && (
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 mb-5">
                  {t('publishedAt', { date: formattedDate })}
                </p>
              )}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight tracking-[-0.025em] max-w-2xl">
                {translation.title}
              </h1>
              <div className="mt-7 h-[3px] w-12 bg-accent" />
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
        style={{ originX: 0 }}
        className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 mt-10 sm:mt-12"
      >
        <div className="h-px bg-gradient-to-r from-accent/35 via-accent/10 to-transparent" />
      </motion.div>

      {/* ── Article body ────────────────────────────────────────────────────── */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.65 }}
        className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-14"
      >
        <MarkdownRenderer content={translation.content_md} />
      </motion.article>

      {/* ── Footer — back link ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pb-16 sm:pb-24">
        <div className="h-px bg-gradient-to-r from-accent/20 via-border to-transparent mb-10" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-200"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
            {t('backToBlog')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
