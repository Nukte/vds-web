import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/database.types';

/**
 * Server-side Supabase client.
 * Use in Server Components, Server Actions, and Route Handlers.
 * This client reads and sets cookies via next/headers to maintain session.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll is called from a Server Component in a read-only context.
            // Middleware will handle session refresh in that case — safe to ignore.
          }
        },
      },
    },
  );
}
