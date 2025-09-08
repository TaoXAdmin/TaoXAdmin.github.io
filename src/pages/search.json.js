// src/pages/search.json.js
import { getCollection } from 'astro:content';

export async function GET() {
  // 1) Blog (toutes langues)
  const blog = await getCollection('blog', (e) => !e.data.draft);
  const blogItems = blog.map((e) => {
    const lang = (e.slug.match(/\.(fr|en|de|pt)$/) || [])[1] || 'fr';
    const slugNoLang = e.slug.replace(/\.(fr|en|de|pt)$/, '');
    return {
      title: e.data.title,
      description: e.data.description || '',
      url: `/${lang}/blog/${slugNoLang}`,
      lang,
      type: 'blog',
    };
  });

  // 2) Pages clés (manuel, court et robuste)
  const staticPages = [
    // fr
    { title: 'Services', description: 'Offres QA, CI/CD, k6, GenAI, coaching', url: '/fr/services', lang: 'fr', type: 'page' },
    { title: 'Cas', description: 'Études de cas Xpollens, Ornikar', url: '/fr/cases', lang: 'fr', type: 'page' },
    { title: 'À propos', description: 'Bio, parcours, liens', url: '/fr/about', lang: 'fr', type: 'page' },
    { title: 'Contact', description: 'Formulaire de contact & alternatives', url: '/fr/contact', lang: 'fr', type: 'page' },

    // en
    { title: 'Services', description: 'QA, CI/CD, k6, GenAI, coaching', url: '/en/services', lang: 'en', type: 'page' },
    { title: 'Cases', description: 'Case studies Xpollens, Ornikar', url: '/en/cases', lang: 'en', type: 'page' },
    { title: 'About', description: 'Bio, background, links', url: '/en/about', lang: 'en', type: 'page' },
    { title: 'Contact', description: 'Contact form & alternatives', url: '/en/contact', lang: 'en', type: 'page' },

    // de
    { title: 'Dienstleistungen', description: 'QA, CI/CD, k6, GenAI, Coaching', url: '/de/services', lang: 'de', type: 'page' },
    { title: 'Referenzen', description: 'Fallstudien Xpollens, Ornikar', url: '/de/cases', lang: 'de', type: 'page' },
    { title: 'Über mich', description: 'Bio, Werdegang, Links', url: '/de/about', lang: 'de', type: 'page' },
    { title: 'Kontakt', description: 'Kontaktformular & Alternativen', url: '/de/contact', lang: 'de', type: 'page' },

    // pt
    { title: 'Serviços', description: 'QA, CI/CD, k6, GenAI, coaching', url: '/pt/services', lang: 'pt', type: 'page' },
    { title: 'Projetos', description: 'Estudos de caso Xpollens, Ornikar', url: '/pt/cases', lang: 'pt', type: 'page' },
    { title: 'Sobre', description: 'Bio, trajetória, links', url: '/pt/about', lang: 'pt', type: 'page' },
    { title: 'Contato', description: 'Formulário & alternativas', url: '/pt/contact', lang: 'pt', type: 'page' },
  ];

  const items = [...blogItems, ...staticPages];

  return new Response(JSON.stringify({ items }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
