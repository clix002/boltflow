import { createRoute, z } from "@hono/zod-openapi";
import {
	CatalogOptionSchema,
	CatalogSlugSchema,
} from "@scrum-board/shared/schemas";

export const getCatalogBySlugRoute = createRoute({
	method: "get",
	tags: ["Catalog"],
	path: "/{slug}",
	request: {
		params: z.object({
			slug: CatalogSlugSchema,
		}),
	},
	responses: {
		200: {
			description: "Catalog options for the requested slug",
			content: {
				"application/json": {
					schema: z.array(CatalogOptionSchema),
				},
			},
		},
	},
});
