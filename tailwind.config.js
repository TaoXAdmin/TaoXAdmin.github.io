/**
 * Tailwind CSS configuration for the portfolio.  The content paths
 * include Astro components, pages and markdown content.  Dark mode
 * is toggled via the `class` strategy so visitors can choose light
 * or dark themes.  Additional plugins enable rich typography and
 * accessible form styles.  The container is centered with sensible
 * padding by default.
 */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}',
    './src/content/**/*.{md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
      },
      colors: {
        neutral: colors.neutral,
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};