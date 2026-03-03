import { getTranslations } from 'next-intl/server';
import { getAuthenticatedUser } from '@/services/auth';
import { Link } from '@/i18n/navigation';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return { title: t('adminPanel'), robots: { index: false, follow: false } };
}

export default async function AdminDashboardPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });

  const user = await getAuthenticatedUser();

  const sections = [
    {
      title: t('apps'),
      href: '/admin/apps' as const,
      description: t('manageApps'),
      active: true,
    },
    {
      title: t('projects'),
      href: '/admin/projects' as const,
      description: t('manageProjects'),
      active: true,
    },
    {
      title: t('blog'),
      href: '/admin/blog' as const,
      description: t('manageBlog'),
      active: true,
    },
  ];

  return (
    <section>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">
          {t('welcome')}, {user?.email}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('adminPanel')}</p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sections.map((section) => (
          <li key={section.title}>
            {section.active ? (
              <Link
                href={section.href}
                className="block rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-accent hover:bg-muted"
              >
                <p className="font-medium text-foreground">{section.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
              </Link>
            ) : (
              <div className="rounded-lg border border-border bg-card p-5 opacity-50 cursor-not-allowed">
                <p className="font-medium text-foreground">{section.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
