import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const tFooter = await getTranslations('footer');

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <p className="font-mono text-xs text-muted-foreground">
          © {year} ali kemal kara — {tFooter('rights')}
        </p>

        <nav aria-label="Sosyal bağlantılar" className="flex items-center gap-4">
          <a
            href="https://github.com/nukte"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/ali-kemal-kara"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
