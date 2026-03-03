import createIntlMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

const locales = ['tr', 'en'] as const;
const defaultLocale = 'tr';

/**
 * next-intl middleware handles:
 *  - Locale detection (Accept-Language header, cookie)
 *  - Prefix-based routing: /tr/..., /en/...
 *  - Redirect / → /tr (defaultLocale)
 */
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Auth callback bypass ──────────────────────────────────────────────
  // The /auth/callback route must NOT be touched by i18n redirects —
  // doing so breaks the Supabase PKCE flow and causes an infinite auth loop.
  if (pathname === '/auth/callback') {
    return NextResponse.next();
  }

  // ── 2. Supabase session refresh ──────────────────────────────────────────
  // updateSession() calls getUser() which silently refreshes the JWT if
  // expired. We MUST do this before any route decision so `user` is accurate.
  const { response: supabaseResponse, user } = await updateSession(request);

  // ── 3. Admin route guard ─────────────────────────────────────────────────
  // Pattern: /<locale>/admin or /<locale>/admin/...
  // Built dynamically from the `locales` constant so they can never drift apart.
  const adminGuardPattern = new RegExp(
    `^\\/(?:${locales.join('|')})\\/admin(?:\\/|$)`
  );
  const isAdminRoute = adminGuardPattern.test(pathname);
  if (isAdminRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${defaultLocale}/giris`;
    return NextResponse.redirect(loginUrl);
  }

  // ── 4. i18n routing ──────────────────────────────────────────────────────
  const intlResponse = intlMiddleware(request);

  // ── 5. Cookie merge ───────────────────────────────────────────────────────
  // Copy all Supabase session cookies into the intl response so BOTH the
  // refreshed session token AND the locale cookie reach the browser together.
  // Omitting this step causes the session to be lost on every navigatio n.
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    const rawSameSite = typeof cookie.sameSite === 'string' ? cookie.sameSite.toLowerCase() : undefined;
    const sameSite =
      rawSameSite === 'strict' || rawSameSite === 'lax' || rawSameSite === 'none'
        ? (rawSameSite as 'strict' | 'lax' | 'none')
        : undefined;

    intlResponse.cookies.set(cookie.name, cookie.value, {
      path: cookie.path,
      sameSite,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
      expires: cookie.expires ? new Date(cookie.expires) : undefined,
      maxAge: cookie.maxAge,
    });
  });

  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all routes EXCEPT:
     *  - _next/static  (Next.js build artefacts)
     *  - _next/image   (image optimisation endpoint)
     *  - favicon.ico
     *  - Any file with a known static extension
     *
     * This prevents middleware from running on static assets and
     * eliminates the "Infinite Redirect Loop" risk on asset requests.
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
};
