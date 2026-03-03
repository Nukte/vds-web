import { getTranslations } from 'next-intl/server';
import { getProjects } from '@/services/projects';
import ProjectManager from './_components/ProjectManager';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return { title: `${t('projects')} — ${t('adminPanel')}`, robots: { index: false, follow: false } };
}

export default async function AdminProjectsPage({ params }: Props) {
  const { locale } = await params;
  const [t, projects] = await Promise.all([
    getTranslations({ locale, namespace: 'admin' }),
    getProjects(),
  ]);

  const labels = {
    addNew: t('addNew'),
    edit: t('edit'),
    delete: t('delete'),
    title: t('projectTitle'),
    description: t('description'),
    tags: t('tags'),
    githubUrl: t('githubUrl'),
    liveUrl: t('liveUrl'),
    orderIndex: t('orderIndex'),
    save: t('save'),
    saving: t('saving'),
    cancel: t('cancel'),
    confirmDelete: t('confirmDeleteProject'),
    saveSuccess: t('projectSaveSuccess'),
    deleteSuccess: t('projectDeleteSuccess'),
  };

  return (
    <section>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          {t('projects')}
        </h1>
      </header>
      <ProjectManager projects={projects} labels={labels} />
    </section>
  );
}
