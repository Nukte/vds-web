import { getRequestConfig } from 'next-intl/server';

const locales = ['tr', 'en'] as const;
type Locale = (typeof locales)[number];

function isValidLocale(locale: string | undefined): locale is Locale {
  return locales.includes(locale as Locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const rawLocale = await requestLocale;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'tr';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
