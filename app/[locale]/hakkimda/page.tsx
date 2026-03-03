import { getTranslations } from 'next-intl/server';

export default async function HakkimdaPage() {
  const t = await getTranslations('about');

  const experiences = [
    {
      title: t('exp0Title'),
      company: t('exp0Company'),
      period: t('exp0Period'),
      location: t('exp0Location'),
      description: t('exp0Description'),
    },
    {
      title: t('exp1Title'),
      company: t('exp1Company'),
      period: t('exp1Period'),
      location: t('exp1Location'),
      description: null,
    },
  ];

  const education = [
    {
      title: t('edu0Title'),
      degree: t('edu0Degree'),
      period: t('edu0Period'),
      description: null,
    },
    {
      title: t('edu1Title'),
      degree: t('edu1Degree'),
      period: t('edu1Period'),
      description: t('edu1Description'),
    },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .fade-up {
          opacity: 0;
          animation: fadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.18s; }
        .d3 { animation-delay: 0.30s; }
        .d4 { animation-delay: 0.42s; }
        .d5 { animation-delay: 0.54s; }

        .photo-hatch {
          background-image: repeating-linear-gradient(
            -45deg,
            var(--border) 0px,
            var(--border) 1px,
            transparent 1px,
            transparent 10px
          );
        }

        .timeline-track {
          position: relative;
        }
        .timeline-track::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.6rem;
          bottom: 0.6rem;
          width: 1px;
          background: linear-gradient(to bottom, var(--accent), transparent 90%);
        }

        .tl-dot {
          position: absolute;
          left: -1.45rem;
          top: 1.1rem;
          width: 0.55rem;
          height: 0.55rem;
          border-radius: 50%;
          border: 1.5px solid var(--accent);
          background: var(--background);
          transition: background 0.2s;
        }
        .tl-card:hover .tl-dot {
          background: var(--accent);
        }
      `}</style>

      <div className="mx-auto max-w-4xl px-4 pb-28 pt-20 sm:px-6 sm:pt-28">

        {/* ── Page label ── */}
        <div className="fade-up d1 mb-14 flex items-center gap-4">
          <span
            className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-accent"
          >
            {t('pageLabel')}
          </span>
          <div className="h-px w-16 bg-accent/40" />
        </div>

        {/* ── Hero: photo + bio ── */}
        <div className="fade-up d2 mb-24 grid grid-cols-1 gap-10 md:grid-cols-5 md:items-start">
          {/* Photo placeholder — 2 columns */}
          <div className="relative md:col-span-2">
            <div
              className="photo-hatch relative aspect-[3/4] overflow-hidden rounded-sm border border-border"
            >
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground/50">
                <svg
                  width="36" height="36" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1.2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em]">
                  {t('photoPlaceholder')}
                </span>
              </div>
            </div>
            {/* Decorative accent corner */}
            <div
              className="pointer-events-none absolute -bottom-2.5 -right-2.5 h-12 w-12 border-b-2 border-r-2 border-accent"
            />
          </div>

          {/* Bio — 3 columns */}
          <div className="flex flex-col justify-center gap-7 md:col-span-3">
            <div>
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
                Ali Kemal<br />
                <em className="not-italic text-accent">Kara</em>
              </h1>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t('tagline')}
              </p>
            </div>

            <p className="text-[0.95rem] leading-[1.8] text-muted-foreground">
              {t('bio')}
            </p>


          </div>
        </div>

        {/* ── Experience ── */}
        <section className="fade-up d3 mb-20">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-7 w-[3px] rounded-full bg-accent" />
            <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              {t('sectionExperience')}
            </h2>
          </div>

          <div className="timeline-track pl-7 space-y-6">
            {experiences.map((exp, i) => (
              <div key={i} className="tl-card group relative pl-6">
                <div className="tl-dot" />
                <div
                  className="rounded-sm border border-border bg-card p-5 transition-colors duration-300 group-hover:border-accent/40"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="font-display text-base font-semibold text-foreground sm:text-lg">
                      {exp.title}
                    </h3>
                    <span className="shrink-0 font-mono text-[0.65rem] text-accent">
                      {exp.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground/70">
                    {exp.company}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.65rem] text-muted-foreground/60">
                    {exp.location}
                  </p>
                  {exp.description && (
                    <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Education ── */}
        <section className="fade-up d4">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-7 w-[3px] rounded-full bg-accent" />
            <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              {t('sectionEducation')}
            </h2>
          </div>

          <div className="timeline-track pl-7 space-y-6">
            {education.map((edu, i) => (
              <div key={i} className="tl-card group relative pl-6">
                <div className="tl-dot" />
                <div
                  className="rounded-sm border border-border bg-card p-5 transition-colors duration-300 group-hover:border-accent/40"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="font-display text-base font-semibold text-foreground sm:text-lg">
                      {edu.title}
                    </h3>
                    <span className="shrink-0 font-mono text-[0.65rem] text-accent">
                      {edu.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground/70">
                    {edu.degree}
                  </p>
                  {edu.description && (
                    <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
