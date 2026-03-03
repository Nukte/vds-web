'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface Project {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
  github_url: string | null;
  live_url: string | null;
  order_index: number;
  created_at: string;
}

interface ProjectsPageContentProps {
  projects: Project[];
  title: string;
  description: string;
  empty: string;
  visitSiteLabel: string;
  viewCodeLabel: string;
}

/* ── Animated SVG corner brackets ───────────────────────────────────── */
function CornerBrackets() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      fill="none"
    >
      {/* Top-left */}
      <motion.path
        d="M 20 2 L 2 2 L 2 20"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinecap="square"
        pathLength={1}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bracket-tl opacity-0 [.group:hover_&]:opacity-100"
        style={{ transition: 'opacity 0.25s' }}
      />
      {/* Top-right via calc */}
      <motion.path
        d="M calc(100% - 20px) 2 L calc(100% - 2px) 2 L calc(100% - 2px) 20"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinecap="square"
        pathLength={1}
        className="opacity-0 [.group:hover_&]:opacity-100"
        style={{ transition: 'opacity 0.25s 0.05s' }}
      />
      {/* Bottom-left */}
      <motion.path
        d="M 2 calc(100% - 20px) L 2 calc(100% - 2px) L 20 calc(100% - 2px)"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinecap="square"
        className="opacity-0 [.group:hover_&]:opacity-100"
        style={{ transition: 'opacity 0.25s 0.1s' }}
      />
      {/* Bottom-right */}
      <motion.path
        d="M calc(100% - 20px) calc(100% - 2px) L calc(100% - 2px) calc(100% - 2px) L calc(100% - 2px) calc(100% - 20px)"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinecap="square"
        className="opacity-0 [.group:hover_&]:opacity-100"
        style={{ transition: 'opacity 0.25s 0.15s' }}
      />
    </svg>
  );
}

/* ── Project card ────────────────────────────────────────────────────── */
function ProjectCard({
  project,
  index,
  featured,
  visitSiteLabel,
  viewCodeLabel,
}: {
  project: Project;
  index: number;
  featured: boolean;
  visitSiteLabel: string;
  viewCodeLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const paddedIndex = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 }}
      animate={
        isInView
          ? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }
          : { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 }
      }
      transition={{ duration: 0.65, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={featured ? 'col-span-full md:col-span-2' : ''}
    >
      <div className="group relative flex h-full min-h-[220px] flex-col border border-border/50 p-6 transition-colors duration-300 hover:border-accent/40 hover:bg-muted/30 sm:p-8">
        <CornerBrackets />

        {/* Ghost ordinal */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 right-4 select-none font-display text-[5rem] font-light leading-none text-foreground/[0.04] transition-colors duration-300 group-hover:text-accent/[0.07] sm:text-[6.5rem]"
        >
          {paddedIndex}
        </span>

        {/* Header row */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            {paddedIndex}
          </span>

          {/* Accent tick */}
          <motion.span
            aria-hidden
            className="block h-px w-6 origin-right bg-accent/50 transition-all duration-300 group-hover:w-12 group-hover:bg-accent"
          />
        </div>

        {/* Title */}
        <h2
          className={`font-display font-light italic leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent ${
            featured
              ? 'mb-4 text-3xl sm:text-4xl lg:text-5xl'
              : 'mb-3 text-2xl sm:text-3xl'
          }`}
        >
          {project.title}
        </h2>

        {/* Description */}
        {project.description && (
          <p
            className={`leading-relaxed text-muted-foreground ${
              featured ? 'mb-5 max-w-xl text-sm sm:text-base' : 'mb-4 text-sm'
            }`}
          >
            {project.description}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            {project.tags.slice(0, featured ? 6 : 4).map((tag) => (
              <span
                key={tag}
                className="border border-border/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors duration-200 group-hover:border-accent/30 group-hover:text-foreground/70"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-5 overflow-hidden">
          <div
            className="flex items-center gap-5 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/lnk inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-accent transition-colors hover:text-foreground"
              >
                <span>{visitSiteLabel}</span>
                <svg
                  className="h-3 w-3 transition-transform group-hover/lnk:translate-x-0.5 group-hover/lnk:-translate-y-0.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/lnk inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>{viewCodeLabel}</span>
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Page content ───────────────────────────────────────────────────── */
export default function ProjectsPageContent({
  projects,
  title,
  description,
  empty,
  visitSiteLabel,
  viewCodeLabel,
}: ProjectsPageContentProps) {
  return (
    <main className="relative overflow-hidden">
      {/* ────────────────────────── Hero ──────────────────────────── */}
      <section
        aria-labelledby="projects-page-heading"
        className="relative px-6 pt-20 pb-16 sm:px-10 sm:pt-28 sm:pb-20 lg:px-16 lg:pt-32 lg:pb-20"
      >
        {/* Subtle radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_0%,var(--accent)/0.06,transparent)]"
        />

        {/* Vertical margin rule — left edge */}
        <motion.div
          aria-hidden
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute left-6 top-0 hidden h-full w-px origin-top bg-gradient-to-b from-accent/40 via-accent/10 to-transparent sm:left-10 lg:left-16 lg:block"
        />

        <div className="relative z-10 max-w-6xl lg:pl-8">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 flex items-center gap-4 sm:mb-12"
          >
            <span className="h-px w-8 bg-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              {description}
            </span>
          </motion.div>

          {/* Split heading — first word normal, rest italic shifted */}
          <div className="overflow-hidden">
            <motion.h1
              id="projects-page-heading"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[clamp(3.5rem,10vw,8rem)] font-light leading-[0.88] tracking-tight text-foreground"
            >
              {title}
            </motion.h1>
          </div>

          {/* Subline: count + thin horizontal rule */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 flex items-center gap-6 sm:mt-12"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-px flex-1 origin-left bg-gradient-to-r from-accent/50 via-border/60 to-transparent"
            />
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {String(projects.length).padStart(2, '0')} &nbsp;işler
            </span>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── Project grid ─────────────────────────────── */}
      <section
        aria-label="Tüm projeler"
        className="mx-auto max-w-6xl px-6 pb-24 sm:px-10 sm:pb-32 lg:px-16"
      >
        {projects.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-mono text-sm text-muted-foreground"
          >
            {empty}
          </motion.p>
        ) : (
          <div className={`grid grid-cols-1 gap-px bg-border/40 ${projects.length >= 2 ? 'md:grid-cols-2' : ''} ${projects.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                featured={i === 0 && projects.length >= 3}
                visitSiteLabel={visitSiteLabel}
                viewCodeLabel={viewCodeLabel}
              />
            ))}
          </div>
        )}

        {/* Bottom signature line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-px h-px origin-left bg-gradient-to-r from-accent/30 via-border/20 to-transparent"
        />
      </section>
    </main>
  );
}
