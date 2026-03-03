'use client';

import { motion } from 'motion/react';
import Typewriter from '@/components/ui/Typewriter';

const TYPEWRITER_WORDS = [
  'Software Developer Candidate',
  'System Design',
  'Software Architecture',
];

interface HeroSectionProps {
  description: string;
  scrollHint: string;
  wit: string;
  serious: string;
}

export default function HeroSection({
  description,
  scrollHint,
  wit,
  serious,
}: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[92vh] flex flex-col justify-center px-6 sm:px-10 lg:px-16 overflow-hidden"
    >
      {/* ── Decorative index number ─────────────────────────────── */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className="pointer-events-none absolute -right-4 -top-8 select-none font-mono text-[10rem] leading-none text-accent/[0.06] sm:text-[16rem] lg:text-[20rem]"
      >
        01
      </motion.span>

      {/* ── Diagonal decorative line ────────────────────────────── */}
      <motion.div
        aria-hidden
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        className="pointer-events-none absolute left-[12%] top-[8%] hidden h-[45%] w-px origin-top bg-gradient-to-b from-accent/30 via-accent/10 to-transparent lg:block"
      />

      {/* ── Name ────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl">
        <div className="overflow-hidden">
          <motion.h1
            id="hero-heading"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="font-display text-[clamp(2.8rem,9vw,8rem)] font-light leading-[0.9] tracking-tight text-foreground"
          >
            Ali Kemal
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.span
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.25, 0.4, 0.25, 1] }}
            className="mt-1 inline-block font-display text-[clamp(2.8rem,9vw,8rem)] font-bold leading-[0.9] tracking-tight text-foreground sm:mt-2"
          >
            <span className="relative">
              Kara
              {/* Gold accent underline */}
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                className="absolute -bottom-2 left-0 h-1 w-full origin-left bg-accent sm:-bottom-3 sm:h-1.5"
              />
            </span>
          </motion.span>
        </div>
      </div>

      {/* ── Gold horizontal rule ────────────────────────────────── */}
      <motion.hr
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
        className="my-8 h-px w-full max-w-6xl origin-left border-0 bg-gradient-to-r from-accent/60 via-accent/20 to-transparent sm:my-12"
      />

      {/* ── Tagline + Description ───────────────────────────────── */}
      <div className="relative z-10 flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
          className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground sm:text-sm"
        >
          <Typewriter words={TYPEWRITER_WORDS} />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex max-w-md flex-col gap-4 sm:items-end"
        >
          {/* Espri — mono, italik, soluk */}
          <p className="font-mono text-[0.7rem] italic leading-relaxed tracking-wide text-muted-foreground/50 sm:text-right">
            {wit}
          </p>

          {/* Gerçek söz — büyük, bold, aksan rengi */}
          <p className="border-l-2 border-accent pl-3 text-sm font-semibold leading-snug text-foreground sm:border-l-0 sm:border-r-2 sm:pl-0 sm:pr-3 sm:text-right sm:text-base">
            {serious}
          </p>
        </motion.div>
      </div>

      {/* ── Scroll indicator ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
          {scrollHint}
        </span>
        <span
          className="block h-8 w-px bg-accent/50"
          style={{ animation: 'scrollPulse 2s ease-in-out infinite' }}
        />
      </motion.div>
    </section>
  );
}
