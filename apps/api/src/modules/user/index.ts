import { createRouter } from "@/lib/openapi";
import { authMiddleware } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/modules/auth/types";
import { listUsersHandler } from "./user.handlers";
import { listUsersRoute } from "./user.routes";

const userRouter = createRouter<AppEnv>();
userRouter.use("*", authMiddleware);

userRouter.openapi(listUsersRoute, listUsersHandler);

export default userRouter;
