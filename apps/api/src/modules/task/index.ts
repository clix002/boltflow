import { createRouter } from "@/lib/openapi";
import { authMiddleware } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/modules/auth/types";
import {
	createBranchHandler,
	createHandler,
	deleteHandler,
	moveHandler,
	updateHandler,
} from "./task.handlers";
import {
	createTaskBranchRoute,
	createTaskRoute,
	deleteTaskRoute,
	moveTaskRoute,
	updateTaskRoute,
} from "./task.routes";

const taskRouter = createRouter<AppEnv>();
taskRouter.use("*", authMiddleware);

taskRouter.openapi(createTaskRoute, createHandler);
taskRouter.openapi(updateTaskRoute, updateHandler);
taskRouter.openapi(createTaskBranchRoute, createBranchHandler);
taskRouter.openapi(moveTaskRoute, moveHandler);
taskRouter.openapi(deleteTaskRoute, deleteHandler);

export default taskRouter;
