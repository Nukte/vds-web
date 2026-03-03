import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/database.types';

/**
 * Browser (Client Component) Supabase client.
 * Use this in "use client" components for reads or realtime subscriptions.
 * All mutations must go through Server Actions — not through this client.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
