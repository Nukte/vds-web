import { getTranslations } from 'next-intl/server';
import { HeaderClient } from './HeaderClient';

const NAV_HREFS = [
  { href: '/',           key: 'home'     },
  { href: '/hakkimda',   key: 'about'    },
  { href: '/projeler',   key: 'projects' },
  { href: '/blog',       key: 'blog'     },
  { href: '/iletisim',   key: 'contact'  },
  { href: '/uygulamalar',key: 'apps'     },
] as const;

export async function Header() {
  const [tNav, tTheme, tLang] = await Promise.all([
    getTranslations('nav'),
    getTranslations('theme'),
    getTranslations('language'),
  ]);

  const navItems = NAV_HREFS.map(({ href, key }) => ({
    href,
    label: tNav(key),
  }));

  return (
    <HeaderClient
      navItems={navItems}
      themeLabel={tTheme('toggle')}
      langLabels={{
        tr: tLang('tr'),
        en: tLang('en'),
        toggle: tLang('toggle'),
      }}
      navLabel={tNav('home')}
    />
  );
}
