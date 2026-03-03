'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import AnimatedSection from './AnimatedSection';

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

interface ProjectsShowcaseProps {
  projects: Project[];
  title: string;
  viewAllLabel: string;
  visitSiteLabel: string;
  viewCodeLabel: string;
  viewAllHref: string;
}

function ProjectRow({
  project,
  index,
  visitSiteLabel,
  viewCodeLabel,
}: {
  project: Project;
  index: number;
  visitSiteLabel: string;
  viewCodeLabel: string;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const paddedIndex = String(index + 1).padStart(2, '0');

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className="group relative border-b border-border/60 last:border-b-0"
    >
      <div className="relative flex flex-col gap-4 py-8 transition-colors sm:flex-row sm:items-start sm:gap-8 sm:py-10 lg:gap-12">
        {/* Gold left accent on hover */}
        <div
          aria-hidden
          className="absolute -left-4 top-0 h-full w-0.5 origin-top scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100 sm:-left-6"
        />

        {/* Index + Tags column */}
        <div className="flex shrink-0 items-start gap-4 sm:w-32 sm:flex-col sm:gap-3 lg:w-40">
          <span className="font-mono text-3xl font-light text-accent/40 transition-all duration-300 group-hover:text-accent group-hover:scale-105 lg:text-4xl">
            {paddedIndex}
          </span>
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-1">
              {project.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Title + Description + Links */}
        <div className="flex flex-1 flex-col gap-3">
          <h3 className="font-display text-xl font-medium text-foreground transition-colors group-hover:text-accent sm:text-2xl lg:text-3xl">
            {project.title}
          </h3>

          {project.description && (
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {project.description}
            </p>
          )}

          {/* Links — revealed on hover (visible on mobile) */}
          <div className="mt-2 flex items-center gap-5 sm:mt-0 sm:translate-y-2 sm:opacity-0 sm:transition-all sm:duration-300 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:text-foreground"
              >
                <span>{visitSiteLabel}</span>
                <svg
                  className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
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
                className="group/link inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>{viewCodeLabel}</span>
                <svg
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Hover arrow indicator (desktop) */}
        <div
          aria-hidden
          className="hidden shrink-0 self-center font-display text-2xl text-accent/0 transition-all duration-300 group-hover:text-accent group-hover:translate-x-1 sm:block"
        >
          →
        </div>
      </div>
    </motion.li>
  );
}

export default function ProjectsShowcase({
  projects,
  title,
  viewAllLabel,
  visitSiteLabel,
  viewCodeLabel,
  viewAllHref,
}: ProjectsShowcaseProps) {
  if (projects.length === 0) return null;

  return (
    <section aria-labelledby="projects-heading" className="relative px-6 sm:px-10 lg:px-16">
      {/* ── Decorative index ─────────────────────────────────────── */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-2 -top-6 select-none font-mono text-[7rem] leading-none text-accent/[0.05] sm:-left-4 sm:text-[10rem]"
      >
        02
      </span>

      {/* ── Section Header ───────────────────────────────────────── */}
      <AnimatedSection className="mb-10 sm:mb-14">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="projects-heading"
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

      {/* ── Project List ─────────────────────────────────────────── */}
      <ul className="relative">
        {projects.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={i}
            visitSiteLabel={visitSiteLabel}
            viewCodeLabel={viewCodeLabel}
          />
        ))}
      </ul>

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
