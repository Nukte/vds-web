import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/database.types';
import type { User } from '@supabase/supabase-js';

/**
 * Refreshes the Supabase auth session inside middleware.
 * Returns the updated response (with refreshed cookies) and the current user.
 *
 * IMPORTANT: The returned `response` must have its cookies merged into the
 * final response to keep the session alive across requests.
 */
export async function updateSession(request: NextRequest): Promise<{
  response: NextResponse;
  user: User | null;
}> {
  // Start with a pass-through response that forwards the request as-is.
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write cookies back to the request (for downstream reads) …
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // … and to the response (so the browser receives them).
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() triggers the token refresh. Never use getSession() here —
  // it trusts unverified JWT data and is unsuitable for server-side auth checks.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
