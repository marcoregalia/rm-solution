import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const casiStudio = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    settore: z.string(),
    dimensione: z.string(),
    risultato: z.string(),
    durata: z.string().optional(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  'blog': blog,
  'casi-studio': casiStudio,
};
