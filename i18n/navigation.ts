import { createNavigation } from 'next-intl/navigation';

export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];

/**
 * next-intl v4 navigation utilities.
 * Use these instead of next/link, next/navigation wherever locale-awareness is needed.
 *   - Link        → locale-prefixed <a> tag
 *   - usePathname → pathname without locale prefix
 *   - useRouter   → locale-aware push/replace
 *   - redirect    → locale-aware redirect (server-side)
 */
export const { Link, usePathname, useRouter, redirect, getPathname } =
  createNavigation({ locales, localePrefix: 'always' });
