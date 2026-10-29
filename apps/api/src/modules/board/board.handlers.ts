import type { RouteHandler } from "@hono/zod-openapi";
import { parseLimit, parsePage } from "@/lib/pagination/paginate";
import type { AppEnv } from "@/modules/auth/types";
import type {
	createBoardBoltRoute,
	createBoardRoute,
	createBoardUnitRoute,
	deleteBoardBoltRoute,
	deleteBoardRoute,
	deleteBoardUnitRoute,
	getBoardByIdRoute,
	getBoardGitHubBranchesRoute,
	listBoardsRoute,
	updateBoardBoltRoute,
	updateBoardRoute,
	updateBoardUnitRoute,
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

export const getGitHubBranchesHandler: RouteHandler<
	typeof getBoardGitHubBranchesRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const id = c.req.param("id");

	const githubInfo = await boardService.getGitHubInfo({ id, userId });
	return c.json(githubInfo, 200);
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

export const createUnitHandler: RouteHandler<
	typeof createBoardUnitRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const { id: boardId } = c.req.valid("param");
	const data = c.req.valid("json");

	const unit = await boardService.createUnit({ boardId, userId, data });
	return c.json(unit, 201);
};

export const updateUnitHandler: RouteHandler<
	typeof updateBoardUnitRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const { id: boardId, unitId } = c.req.valid("param");
	const data = c.req.valid("json");

	const unit = await boardService.updateUnit({
		boardId,
		unitId,
		userId,
		data,
	});
	return c.json(unit, 200);
};

export const removeUnitHandler: RouteHandler<
	typeof deleteBoardUnitRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const { id: boardId, unitId } = c.req.valid("param");

	await boardService.removeUnit({ boardId, unitId, userId });
	return c.body(null, 204);
};

export const createBoltHandler: RouteHandler<
	typeof createBoardBoltRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const { id: boardId } = c.req.valid("param");
	const data = c.req.valid("json");

	const bolt = await boardService.createBolt({ boardId, userId, data });
	return c.json(bolt, 201);
};

export const updateBoltHandler: RouteHandler<
	typeof updateBoardBoltRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const { id: boardId, boltId } = c.req.valid("param");
	const data = c.req.valid("json");

	const bolt = await boardService.updateBolt({
		boardId,
		boltId,
		userId,
		data,
	});
	return c.json(bolt, 200);
};

export const removeBoltHandler: RouteHandler<
	typeof deleteBoardBoltRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const { id: boardId, boltId } = c.req.valid("param");

	await boardService.removeBolt({ boardId, boltId, userId });
	return c.body(null, 204);
};
