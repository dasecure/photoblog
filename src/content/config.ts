import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// Schema validation using Zod
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		// Forces standard YYYY-MM-DD formatting
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		// valid references to images in your src/assets folder
		heroImage: image().optional(),
        // Tags for organization
        tags: z.array(z.string()).default(["general"]),
        // Draft status so you can work on posts over time
        draft: z.boolean().default(false),
	}),
});

export const collections = { blog };
