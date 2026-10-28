import type { RouteHandler } from "@hono/zod-openapi";
import type { AppEnv } from "@/modules/auth/types";
import type {
	createTaskRoute,
	moveTaskRoute,
	updateTaskRoute,
} from "./task.routes";
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

export const updateHandler: RouteHandler<
	typeof updateTaskRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const { id } = c.req.valid("param");
	const data = c.req.valid("json");

	const task = await taskService.update({ userId, id, data });
	return c.json(task, 200);
};

export const moveHandler: RouteHandler<typeof moveTaskRoute, AppEnv> = async (
	c,
) => {
	const userId = c.get("jwtPayload").id;
	const { id } = c.req.valid("param");
	const data = c.req.valid("json");

	const task = await taskService.move({ userId, id, data });
	return c.json(task, 200);
};
