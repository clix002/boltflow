import { createRouter } from "@/lib/openapi";
import { authMiddleware } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/modules/auth/types";
import { createHandler } from "./task.handlers";
import { createTaskRoute } from "./task.routes";

const taskRouter = createRouter<AppEnv>();
taskRouter.use("*", authMiddleware);

taskRouter.openapi(createTaskRoute, createHandler);

export default taskRouter;
