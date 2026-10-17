import { OpenAPIHono } from "@hono/zod-openapi";
import { authMiddleware } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/modules/auth/types";
import { createHandler, deleteHandler, updateHandler } from "./column.handlers";
import {
	createColumnRoute,
	deleteColumnRoute,
	updateColumnRoute,
} from "./column.routes";

const columnRouter = new OpenAPIHono<AppEnv>();
columnRouter.use("*", authMiddleware);

columnRouter.openapi(createColumnRoute, createHandler);
columnRouter.openapi(updateColumnRoute, updateHandler);
columnRouter.openapi(deleteColumnRoute, deleteHandler);

export default columnRouter;
