import { createRouter } from "@/lib/openapi";
import { authMiddleware } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/modules/auth/types";
import {
	createHandler,
	getByIdHandler,
	getGitHubBranchesHandler,
	listHandler,
	removeHandler,
	updateHandler,
} from "./board.handlers";
import {
	createBoardRoute,
	deleteBoardRoute,
	getBoardByIdRoute,
	getBoardGitHubBranchesRoute,
	listBoardsRoute,
	updateBoardRoute,
} from "./board.routes";

const boardRouter = createRouter<AppEnv>();
boardRouter.use("*", authMiddleware);

boardRouter.openapi(listBoardsRoute, listHandler);
boardRouter.openapi(getBoardByIdRoute, getByIdHandler);
boardRouter.openapi(getBoardGitHubBranchesRoute, getGitHubBranchesHandler);
boardRouter.openapi(createBoardRoute, createHandler);
boardRouter.openapi(updateBoardRoute, updateHandler);
boardRouter.openapi(deleteBoardRoute, removeHandler);

export default boardRouter;
