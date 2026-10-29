import { createRoute, z } from "@hono/zod-openapi";
import {
	CreateTaskSchema,
	MoveTaskSchema,
	TaskWithAssigneesSchema,
	UpdateTaskSchema,
} from "@scrum-board/shared/schemas";

export const createTaskRoute = createRoute({
	method: "post",
	tags: ["Task"],
	path: "/",
	request: {
		body: {
			content: { "application/json": { schema: CreateTaskSchema } },
		},
	},
	responses: {
		201: {
			description: "Task created successfully",
			content: {
				"application/json": { schema: TaskWithAssigneesSchema },
			},
		},
	},
});

export const updateTaskRoute = createRoute({
	method: "patch",
	tags: ["Task"],
	path: "/:id",
	request: {
		params: z.object({
			id: z.string(),
		}),
		body: {
			content: { "application/json": { schema: UpdateTaskSchema } },
		},
	},
	responses: {
		200: {
			description: "Task updated successfully",
			content: {
				"application/json": { schema: TaskWithAssigneesSchema },
			},
		},
	},
});

export const moveTaskRoute = createRoute({
	method: "patch",
	tags: ["Task"],
	path: "/:id/move",
	request: {
		params: z.object({
			id: z.string(),
		}),
		body: {
			content: { "application/json": { schema: MoveTaskSchema } },
		},
	},
	responses: {
		200: {
			description: "Task moved successfully",
			content: {
				"application/json": { schema: TaskWithAssigneesSchema },
			},
		},
	},
});

export const deleteTaskRoute = createRoute({
	method: "delete",
	tags: ["Task"],
	path: "/:id",
	request: {
		params: z.object({
			id: z.string(),
		}),
	},
	responses: {
		204: {
			description: "Task deleted successfully",
		},
	},
});
