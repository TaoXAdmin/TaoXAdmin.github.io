import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['fr', 'en', 'de', 'pt']),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    // ⚠️ pas de `slug` ici : on utilisera `entry.slug` (dérivé du nom de fichier)
  }),
});

export const collections = { blog };
