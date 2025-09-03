import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Astro configuration for the Alexis portfolio.
//
// - The `site` property defines the canonical domain used for
//   generating absolute URLs in sitemaps and meta tags.  Update
//   this when deploying to a different hostname.
// - Tailwind integration enables the utility‑first CSS framework
//   throughout the project.  The included configuration is kept
//   minimal; see `tailwind.config.js` for customisation.
// - Sitemap integration automatically produces a sitemap.xml at
//   build time, which is referenced in robots.txt and helps
//   search engines discover your pages.

export default defineConfig({
  site: 'https://alexis-fiska.github.io',
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: true,
      },
    }),
    sitemap(),
  ],
  markdown: {
    syntaxHighlight: 'prism',
  },
});