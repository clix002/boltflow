import { createRoute, z } from "@hono/zod-openapi";
import { UserResponseSchema } from "@scrum-board/shared/schemas";

export const listUsersRoute = createRoute({
	method: "get",
	tags: ["User"],
	path: "/",
	responses: {
		200: {
			description: "List of users in workspace",
			content: {
				"application/json": {
					schema: z.array(UserResponseSchema),
				},
			},
		},
	},
});
