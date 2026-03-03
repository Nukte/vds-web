import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const locales = ['tr', 'en'] as const;
type Locale = (typeof locales)[number];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Reject unknown locales — returns Next.js 404
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // getMessages() reads the locale from the request context set by
  // i18n/request.ts — no need to pass it manually.
  const messages = await getMessages();
  const tCommon = await getTranslations('common');

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* Accessibility: skip-to-content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-foreground"
      >
        {tCommon('skipToContent')}
      </a>

      <Header />

      <main id="main-content" className="min-h-[calc(100vh-3.5rem-3.5rem)]">
        {children}
      </main>

      <Footer />

      <Toaster position="top-center" richColors />
    </NextIntlClientProvider>
  );
}
