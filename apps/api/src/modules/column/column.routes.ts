import { createRoute, z } from "@hono/zod-openapi";
import {
	ColumnSchema,
	CreateColumnSchema,
	UpdateColumnSchema,
} from "@scrum-board/shared/schemas";

const ParamsSchema = z.object({
	id: z.string().openapi({
		param: {
			name: "id",
			in: "path",
		},
	}),
});

export const createColumnRoute = createRoute({
	method: "post",
	tags: ["Column"],
	path: "/",
	request: {
		body: {
			content: { "application/json": { schema: CreateColumnSchema } },
		},
	},
	responses: {
		201: {
			description: "Column created successfully",
			content: {
				"application/json": { schema: ColumnSchema },
			},
		},
	},
});

export const updateColumnRoute = createRoute({
	method: "put",
	tags: ["Column"],
	path: "/{id}",
	request: {
		params: ParamsSchema,
		body: {
			content: { "application/json": { schema: UpdateColumnSchema } },
		},
	},
	responses: {
		200: {
			description: "Column updated successfully",
			content: {
				"application/json": { schema: ColumnSchema },
			},
		},
	},
});

export const deleteColumnRoute = createRoute({
	method: "delete",
	tags: ["Column"],
	path: "/{id}",
	request: {
		params: ParamsSchema,
	},
	responses: {
		204: {
			description: "Column deleted successfully",
		},
	},
});
