import { getTranslations } from 'next-intl/server';
import { LoginForm } from './_components/LoginForm';

interface GirisPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GirisPage({ params }: GirisPageProps) {
  const { locale } = await params;
  const t = await getTranslations('auth');

  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Site mark */}
        <div className="mb-8 text-center">
          <p className="font-display text-2xl font-semibold tracking-tight text-accent">
            ali kemal kara
          </p>
        </div>

        {/* Card */}
        <div className="rounded-md border border-border bg-card p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="font-display text-xl font-semibold text-foreground">
              {t('adminLogin')}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('adminLoginDesc')}
            </p>
          </div>

          <LoginForm
            locale={locale}
            labels={{
              email: t('email'),
              password: t('password'),
              signIn: t('signIn'),
              signingIn: t('signingIn'),
              signInError: t('signInError'),
            }}
          />
        </div>
      </div>
    </div>
  );
}
