'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { NavLink } from './NavLink';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavItem {
  href: string;
  label: string;
}

interface HeaderClientProps {
  navItems: NavItem[];
  themeLabel: string;
  langLabels: { tr: string; en: string; toggle: string };
  navLabel: string;
}

export function HeaderClient({
  navItems,
  themeLabel,
  langLabels,
  navLabel,
}: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        data-scrolled={scrolled ? '' : undefined}
        className={[
          'sticky top-0 z-40 w-full transition-all duration-300',
          scrolled
            ? 'border-b border-border bg-background/90 backdrop-blur-md shadow-[0_1px_0_0_var(--border)]'
            : 'border-b border-transparent bg-background/60 backdrop-blur-sm',
        ].join(' ')}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4 sm:px-6">

          {/* ── Logo ── */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-2"
            aria-label="Ana sayfa"
          >
            <span
              aria-hidden="true"
              className="inline-block h-4 w-[2px] rounded-full bg-accent transition-transform duration-300 group-hover:scale-y-125"
            />
            <span className="font-display text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
              akk
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav aria-label={navLabel} className="hidden md:flex items-center gap-0.5">
            {navItems.map(({ href, label }) => (
              <NavLink key={href} href={href}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── Spacer ── */}
          <div className="flex-1" />

          {/* ── Controls ── */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher labels={langLabels} />
            <ThemeToggle label={themeLabel} />

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden inline-flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {/* Three bars → animated X */}
              <span
                className={[
                  'block h-px w-5 rounded-full bg-current transition-all duration-300 origin-center',
                  menuOpen ? 'translate-y-[7px] rotate-45' : '',
                ].join(' ')}
              />
              <span
                className={[
                  'block h-px w-5 rounded-full bg-current transition-all duration-200',
                  menuOpen ? 'opacity-0 scale-x-0' : '',
                ].join(' ')}
              />
              <span
                className={[
                  'block h-px w-5 rounded-full bg-current transition-all duration-300 origin-center',
                  menuOpen ? '-translate-y-[7px] -rotate-45' : '',
                ].join(' ')}
              />
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={[
          'fixed inset-0 z-30 bg-background/60 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* Drawer panel */}
      <nav
        id="mobile-nav"
        aria-label={navLabel}
        aria-hidden={!menuOpen}
        className={[
          'fixed inset-x-0 top-14 z-35 border-b border-border bg-background/95 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden',
          menuOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-3 opacity-0 pointer-events-none',
        ].join(' ')}
      >
        {/* Gold top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-accent/60 via-accent/20 to-transparent" />

        <ul role="list" className="flex flex-col py-3">
          {navItems.map(({ href, label }) => (
            <li key={href} onClick={closeMenu}>
              <NavLink href={href} variant="mobile">
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Bottom padding */}
        <div className="h-4" />
      </nav>
    </>
  );
}
