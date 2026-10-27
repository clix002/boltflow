import { createRoute } from "@hono/zod-openapi";
import {
	CreateTaskSchema,
	TaskWithAssigneesSchema,
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
