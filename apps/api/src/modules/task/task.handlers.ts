import type { RouteHandler } from "@hono/zod-openapi";
import type { AppEnv } from "@/modules/auth/types";
import type { createTaskRoute } from "./task.routes";
import { taskService } from "./task.service";

export const createHandler: RouteHandler<
	typeof createTaskRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const data = c.req.valid("json");

	const task = await taskService.create(userId, data);
	return c.json(task, 201);
};
