import { createRouter } from "@/lib/openapi";
import { authMiddleware } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/modules/auth/types";
import { createHandler, moveHandler, updateHandler } from "./task.handlers";
import { createTaskRoute, moveTaskRoute, updateTaskRoute } from "./task.routes";

const taskRouter = createRouter<AppEnv>();
taskRouter.use("*", authMiddleware);

taskRouter.openapi(createTaskRoute, createHandler);
taskRouter.openapi(updateTaskRoute, updateHandler);
taskRouter.openapi(moveTaskRoute, moveHandler);

export default taskRouter;
