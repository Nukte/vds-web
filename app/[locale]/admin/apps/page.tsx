import { getTranslations } from 'next-intl/server';
import { getApps } from '@/services/apps';
import AppManager from './_components/AppManager';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return { title: `${t('apps')} — ${t('adminPanel')}`, robots: { index: false, follow: false } };
}

export default async function AdminAppsPage({ params }: Props) {
  const { locale } = await params;
  const [t, apps] = await Promise.all([
    getTranslations({ locale, namespace: 'admin' }),
    getApps(),
  ]);

  const labels = {
    addNew: t('addNew'),
    edit: t('edit'),
    delete: t('delete'),
    name: t('name'),
    url: t('url'),
    icon: t('icon'),
    orderIndex: t('orderIndex'),
    save: t('save'),
    saving: t('saving'),
    cancel: t('cancel'),
    confirmDelete: t('confirmDelete'),
    saveSuccess: t('saveSuccess'),
    deleteSuccess: t('deleteSuccess'),
  };

  return (
    <section>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">{t('apps')}</h1>
      </header>
      <AppManager apps={apps} labels={labels} />
    </section>
  );
}
