import { getTranslations } from 'next-intl/server';
import { getProjects } from '@/services/projects';
import ProjectsPageContent from './_components/ProjectsPageContent';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  return { title: t('title') };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const [t, projects] = await Promise.all([
    getTranslations({ locale, namespace: 'projects' }),
    getProjects(),
  ]);

  return (
    <ProjectsPageContent
      projects={projects}
      title={t('title')}
      description={t('description')}
      empty={t('empty')}
      visitSiteLabel={t('viewLive')}
      viewCodeLabel={t('viewOnGithub')}
    />
  );
}
