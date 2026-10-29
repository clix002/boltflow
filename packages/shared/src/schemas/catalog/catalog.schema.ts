import { z } from "zod";

export const CATALOG_SLUG = {
	BOLT_STATUS: "bolt-status",
	UNIT_COLOR: "unit-color",
	TASK_PRIORITY: "task-priority",
	PR_STATUS: "pr-status",
} as const;

export const CatalogSlugSchema = z.enum([
	CATALOG_SLUG.BOLT_STATUS,
	CATALOG_SLUG.UNIT_COLOR,
	CATALOG_SLUG.TASK_PRIORITY,
	CATALOG_SLUG.PR_STATUS,
]);
export type CatalogSlug = z.infer<typeof CatalogSlugSchema>;

export const CatalogOptionSchema = z.object({
	value: z.string(),
	label: z.string(),
	color: z.string().optional(),
});
export type CatalogOption = z.infer<typeof CatalogOptionSchema>;
