import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['fr', 'en', 'de', 'pt']),
    slug: z.string().min(1),
    date: z.coerce.date(),     // parse dates "YYYY-MM-DD"
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
