'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

// Keep this in sync with the `locales` array in proxy.ts
const VALID_LOCALES = ['tr', 'en'] as const;
type Locale = (typeof VALID_LOCALES)[number];

const signInSchema = z.object({
  email: z.string().email('Geçerli bir e-posta girin.'),
  password: z.string().min(1, 'Şifre boş bırakılamaz.'),
});

export type SignInState = {
  error: string | null;
};

export async function signInAction(
  locale: string,
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  // Whitelist check — unknown values fall back to the default locale
  const safeLocale: Locale = (VALID_LOCALES as readonly string[]).includes(locale)
    ? (locale as Locale)
    : 'tr';

  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Geçersiz giriş.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: 'E-posta veya şifre hatalı.' };
  }

  redirect(`/${safeLocale}/admin`);
}
