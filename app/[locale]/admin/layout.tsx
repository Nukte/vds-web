import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });

  const navItems = [
    { href: '/admin' as const, label: t('dashboard') },
    { href: '/admin/apps' as const, label: t('apps') },
    { href: '/admin/projects' as const, label: t('projects') },
    { href: '/admin/blog' as const, label: t('blog') },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <nav className="mb-8 flex gap-1 border-b border-border pb-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <main>{children}</main>
    </div>
  );
}
