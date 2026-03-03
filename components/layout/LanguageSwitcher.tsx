'use client';

import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { type Locale } from '@/i18n/navigation';

interface LanguageSwitcherProps {
  labels: {
    tr: string;
    en: string;
    toggle: string;
  };
}

export function LanguageSwitcher({ labels }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params.locale as Locale) ?? 'tr';

  const switchLocale = (locale: Locale) => {
    router.replace(pathname, { locale });
  };

  return (
    <div role="group" aria-label={labels.toggle} className="flex items-center gap-0.5">
      {(['tr', 'en'] as Locale[]).map((locale) => {
        const isActive = currentLocale === locale;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => switchLocale(locale)}
            disabled={isActive}
            aria-pressed={isActive}
            className={[
              'h-7 px-2 rounded text-xs font-medium tracking-wide uppercase transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground cursor-default'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted',
            ].join(' ')}
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
