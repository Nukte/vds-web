import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { getApps } from '@/services/apps';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'apps' });
  return { title: t('title') };
}

export default async function AppsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'apps' });
  const apps = await getApps();

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-10">
        <h1 className="font-display text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('description')}</p>
      </header>

      {apps.length === 0 ? (
        <p className="text-muted-foreground">{t('empty')}</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {apps.map((app) => (
            <li key={app.id}>
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t('visitApp')}: ${app.name}`}
                className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-accent hover:bg-muted"
              >
                {app.icon_url ? (
                  <div className="relative h-12 w-12 shrink-0">
                    <Image
                      src={app.icon_url}
                      alt={app.name}
                      fill
                      className="object-contain rounded-md"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-2xl shrink-0">
                    📦
                  </div>
                )}
                <span className="text-sm font-medium text-foreground text-center leading-snug group-hover:text-accent transition-colors">
                  {app.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
