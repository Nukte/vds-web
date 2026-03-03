import type { Metadata } from 'next';
import { DM_Sans, Fraunces, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { getLocale } from 'next-intl/server';
import './globals.css';

/**
 * Font variables use names that do NOT clash with Tailwind's --font-* tokens.
 * They are mapped in globals.css → @theme inline:
 *   --font-sans    = var(--font-dm-sans)
 *   --font-display = var(--font-fraunces)
 *   --font-mono    = var(--font-jbm)
 */
const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jbm',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ali kemal kara',
  description: 'Software developer & designer.',
};

/**
 * Root layout — renders <html> and <body>.
 *
 * getLocale() reads the locale resolved by next-intl middleware so the
 * `lang` attribute is always accurate without prop drilling.
 *
 * suppressHydrationWarning on <html> is required by next-themes to prevent
 * a React hydration mismatch when the theme class is applied client-side.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${
          dmSans.variable
        } ${fraunces.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
