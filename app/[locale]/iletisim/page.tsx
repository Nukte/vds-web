import { getTranslations } from 'next-intl/server';

const contacts = [
  {
    key: 'github',
    href: 'https://www.github.com/nukte',
    label: 'GitHub',
    handle: 'github.com/nukte',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/in/ali-kemal-kara/',
    label: 'LinkedIn',
    handle: 'linkedin.com/in/ali-kemal-kara',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
      </svg>
    ),
  },
  {
    key: 'email',
    href: 'mailto:alikemalkaraa0@gmail.com',
    label: 'E-posta',
    handle: 'alikemalkaraa0@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export default async function IletisimPage() {
  const t = await getTranslations('contact');

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cu-fade { opacity: 0; animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards; }
        .cu-d1 { animation-delay: 0.05s; }
        .cu-d2 { animation-delay: 0.18s; }
        .cu-d3 { animation-delay: 0.30s; }
        .cu-d4 { animation-delay: 0.42s; }
        .cu-d5 { animation-delay: 0.54s; }

        .contact-card {
          transition: border-color 0.25s ease, background-color 0.25s ease;
        }
        .contact-card:hover {
          border-color: var(--accent) !important;
          background-color: color-mix(in srgb, var(--accent) 4%, var(--card));
        }
        .contact-card .card-icon {
          transition: color 0.25s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .contact-card:hover .card-icon {
          color: var(--accent);
          transform: scale(1.12);
        }
        .contact-card .card-label {
          transition: color 0.25s ease;
        }
        .contact-card:hover .card-label {
          color: var(--accent);
        }
        .contact-card .card-arrow {
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease;
          opacity: 0.3;
        }
        .contact-card:hover .card-arrow {
          transform: translate(4px, -4px);
          opacity: 1;
          color: var(--accent);
        }
      `}</style>

      <div className="mx-auto max-w-4xl px-4 pb-28 pt-20 sm:px-6 sm:pt-28">

        {/* ── Page label ── */}
        <div className="cu-fade cu-d1 mb-14 flex items-center gap-4">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-accent">
            {t('title')}
          </span>
          <div className="h-px w-16 bg-accent/40" />
        </div>

        {/* ── Heading ── */}
        <div className="cu-fade cu-d2 mb-4">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* ── Contact cards ── */}
        <ul
          role="list"
          className="cu-fade cu-d3 mt-12 flex flex-col gap-4"
        >
          {contacts.map(({ key, href, label, handle, icon }) => (
            <li key={key}>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="contact-card group flex items-center justify-between gap-4 rounded-sm border border-border bg-card px-5 py-4 sm:py-5"
              >
                {/* Left: icon + text */}
                <div className="flex min-w-0 items-center gap-4">
                  <div className="card-icon shrink-0 text-muted-foreground">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="card-label font-display text-base font-semibold text-foreground sm:text-lg">
                      {label}
                    </p>
                    <p className="truncate font-mono text-[0.72rem] text-muted-foreground/70">
                      {handle}
                    </p>
                  </div>
                </div>

                {/* Right: arrow */}
                <div className="card-arrow shrink-0 text-foreground">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </div>
              </a>
            </li>
          ))}
        </ul>

      </div>
    </>
  );
}
