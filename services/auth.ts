import { createClient } from '@/utils/supabase/server';
import type { User } from '@supabase/supabase-js';

/**
 * Returns the currently authenticated user, or null if no session exists.
 * Use this in Server Components / Server Actions to enforce authentication
 * without calling createClient directly in page/action files.
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
