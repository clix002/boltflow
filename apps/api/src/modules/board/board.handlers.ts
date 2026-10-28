import type { RouteHandler } from "@hono/zod-openapi";
import { parseLimit, parsePage } from "@/lib/pagination/paginate";
import type { AppEnv } from "@/modules/auth/types";
import type {
	createBoardRoute,
	deleteBoardRoute,
	getBoardByIdRoute,
	listBoardsRoute,
	updateBoardRoute,
} from "./board.routes";
import { boardService } from "./board.service";

export const listHandler: RouteHandler<typeof listBoardsRoute, AppEnv> = async (
	c,
) => {
	const userId = c.get("jwtPayload").id;
	const page = parsePage(c.req.query("page"));
	const limit = parseLimit(c.req.query("limit"));
	const search = c.req.query("search");
	const { docs, info } = await boardService.listByUser(userId, {
		page,
		limit,
		search,
	});
	return c.json({ docs, info }, 200);
};

export const getByIdHandler: RouteHandler<
	typeof getBoardByIdRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const id = c.req.param("id");
	const query = c.req.valid("query");

	const board = await boardService.getById({ id, userId, filters: query });
	return c.json(board, 200);
};

export const createHandler: RouteHandler<
	typeof createBoardRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const data = c.req.valid("json");

	const board = await boardService.create(userId, data);
	return c.json(board, 201);
};

export const updateHandler: RouteHandler<
	typeof updateBoardRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const id = c.req.param("id");
	const data = c.req.valid("json");

	const board = await boardService.update({ id, userId, data });
	return c.json(board, 200);
};

export const removeHandler: RouteHandler<
	typeof deleteBoardRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const id = c.req.param("id");

	await boardService.remove(id, userId);
	return c.body(null, 204);
};
