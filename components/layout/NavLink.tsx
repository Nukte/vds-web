'use client';

import { type ComponentProps } from 'react';
import { Link, usePathname } from '@/i18n/navigation';

type NavLinkProps = ComponentProps<typeof Link> & {
  children: React.ReactNode;
  /** Pass `mobile` to get the full‑width drawer style */
  variant?: 'desktop' | 'mobile';
};

export function NavLink({ href, children, variant = 'desktop', ...props }: NavLinkProps) {
  const pathname = usePathname();
  const hrefStr = href.toString();

  const isActive =
    hrefStr === '/'
      ? pathname === '/'
      : pathname.startsWith(hrefStr);

  if (variant === 'mobile') {
    return (
      <Link
        href={href}
        {...props}
        aria-current={isActive ? 'page' : undefined}
        className={[
          'flex items-center gap-4 px-6 py-4 font-display text-xl font-semibold tracking-tight transition-colors',
          isActive
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground',
          props.className ?? '',
        ].filter(Boolean).join(' ')}
      >
        {/* Vertical gold bar — always reserves space so text doesn't shift */}
        <span
          aria-hidden="true"
          className={[
            'inline-block h-5 w-[2.5px] rounded-full transition-all duration-300',
            isActive ? 'bg-accent scale-y-100 opacity-100' : 'bg-accent scale-y-0 opacity-0',
          ].join(' ')}
        />
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      {...props}
      aria-current={isActive ? 'page' : undefined}
      className={[
        'group relative flex items-center gap-2 rounded-sm px-3 py-1.5 text-sm transition-colors duration-200',
        isActive
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
        props.className ?? '',
      ].filter(Boolean).join(' ')}
    >
      {/* Vertical gold bar */}
      <span
        aria-hidden="true"
        className={[
          'inline-block h-3.5 w-[2px] rounded-full transition-all duration-300',
          isActive
            ? 'bg-accent opacity-100'
            : 'bg-accent opacity-0 group-hover:opacity-30',
        ].join(' ')}
      />
      <span className={isActive ? 'font-semibold' : 'font-medium'}>
        {children}
      </span>
    </Link>
  );
}
