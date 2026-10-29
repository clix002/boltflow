import { createRouter } from "@/lib/openapi";
import { authMiddleware } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/modules/auth/types";
import {
	createBoltHandler,
	createHandler,
	createUnitHandler,
	getByIdHandler,
	getGitHubBranchesHandler,
	listHandler,
	removeBoltHandler,
	removeHandler,
	removeUnitHandler,
	updateBoltHandler,
	updateHandler,
	updateUnitHandler,
} from "./board.handlers";
import {
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

const boardRouter = createRouter<AppEnv>();
boardRouter.use("*", authMiddleware);

boardRouter.openapi(listBoardsRoute, listHandler);
boardRouter.openapi(getBoardByIdRoute, getByIdHandler);
boardRouter.openapi(getBoardGitHubBranchesRoute, getGitHubBranchesHandler);
boardRouter.openapi(createBoardRoute, createHandler);
boardRouter.openapi(updateBoardRoute, updateHandler);
boardRouter.openapi(deleteBoardRoute, removeHandler);
boardRouter.openapi(createBoardUnitRoute, createUnitHandler);
boardRouter.openapi(updateBoardUnitRoute, updateUnitHandler);
boardRouter.openapi(deleteBoardUnitRoute, removeUnitHandler);
boardRouter.openapi(createBoardBoltRoute, createBoltHandler);
boardRouter.openapi(updateBoardBoltRoute, updateBoltHandler);
boardRouter.openapi(deleteBoardBoltRoute, removeBoltHandler);

export default boardRouter;
