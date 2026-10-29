import {
	BOLT_STATUS,
	CATALOG_SLUG,
	type CatalogOption,
	type CatalogSlug,
	PrioritySchema,
	PrStatusSchema,
} from "@scrum-board/shared/schemas";

export const CATALOG_REGISTRY = {
	[CATALOG_SLUG.BOLT_STATUS]: [
		{ value: BOLT_STATUS.PLANNED, label: "Planned" },
		{ value: BOLT_STATUS.ACTIVE, label: "Active" },
		{ value: BOLT_STATUS.COMPLETED, label: "Completed" },
	],
	[CATALOG_SLUG.UNIT_COLOR]: [
		{ value: "#8b5cf6", label: "Violet", color: "#8b5cf6" },
		{ value: "#3b82f6", label: "Blue", color: "#3b82f6" },
		{ value: "#10b981", label: "Emerald", color: "#10b981" },
		{ value: "#f59e0b", label: "Amber", color: "#f59e0b" },
		{ value: "#ef4444", label: "Red", color: "#ef4444" },
		{ value: "#ec4899", label: "Pink", color: "#ec4899" },
		{ value: "#06b6d4", label: "Cyan", color: "#06b6d4" },
		{ value: "#6366f1", label: "Indigo", color: "#6366f1" },
	],
	[CATALOG_SLUG.TASK_PRIORITY]: [
		{ value: PrioritySchema.enum.LOW, label: "Low" },
		{ value: PrioritySchema.enum.MEDIUM, label: "Medium" },
		{ value: PrioritySchema.enum.HIGH, label: "High" },
		{ value: PrioritySchema.enum.URGENT, label: "Urgent" },
	],
	[CATALOG_SLUG.PR_STATUS]: [
		{ value: PrStatusSchema.enum.NONE, label: "None" },
		{ value: PrStatusSchema.enum.DRAFT, label: "Draft" },
		{ value: PrStatusSchema.enum.OPEN, label: "Open" },
		{ value: PrStatusSchema.enum.MERGED, label: "Merged" },
		{ value: PrStatusSchema.enum.CLOSED, label: "Closed" },
	],
} as const satisfies Record<CatalogSlug, CatalogOption[]>;
