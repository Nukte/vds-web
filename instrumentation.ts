export async function register() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ] as const;

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(
        `[startup] Missing required environment variable: "${key}". ` +
        'Check your .env.local file and your deployment environment settings.',
      );
    }
  }
}
