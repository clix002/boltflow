import type { RouteHandler } from "@hono/zod-openapi";
import type { AppEnv } from "@/modules/auth/types";
import type {
	createColumnRoute,
	deleteColumnRoute,
	updateColumnRoute,
} from "./column.routes";
import { columnService } from "./column.service";

export const createHandler: RouteHandler<
	typeof createColumnRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const data = c.req.valid("json");

	const column = await columnService.create(userId, data);
	return c.json(column, 201);
};

export const updateHandler: RouteHandler<
	typeof updateColumnRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const { id } = c.req.valid("param");
	const data = c.req.valid("json");

	const column = await columnService.update({ id, userId, data });
	return c.json(column, 200);
};

export const deleteHandler: RouteHandler<
	typeof deleteColumnRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const { id } = c.req.valid("param");

	await columnService.remove(id, userId);
	return c.body(null, 204);
};
