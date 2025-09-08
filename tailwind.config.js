/**
 * Tailwind CSS configuration for the portfolio.
 * - Dark mode via `class`
 * - Container centré
 * - Typography + Forms
 * - Police par défaut : Inter (Google Fonts)
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
      fontFamily: {
        // Police UI par défaut
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
        ],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
