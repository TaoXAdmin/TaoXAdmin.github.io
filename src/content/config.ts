import { defineCollection, z } from 'astro:content';

/**
 * Content collections declare how markdown files are parsed and
 * validated.  Blog posts live in the `blog` collection.  Each post
 * includes metadata used to generate routes and provide locale
 * specific titles and descriptions.
 */
const blog = defineCollection({
  type: 'markdown',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['fr', 'en', 'de', 'pt']),
    slug: z.string(),
    date: z.date(),
  }),
});

export const collections = {
  blog,
};