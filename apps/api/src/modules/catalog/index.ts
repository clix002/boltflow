import { createRouter } from "@/lib/openapi";
import { authMiddleware } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/modules/auth/types";
import { getCatalogBySlugHandler } from "./catalog.handlers";
import { getCatalogBySlugRoute } from "./catalog.routes";

const catalogRouter = createRouter<AppEnv>();
catalogRouter.use("*", authMiddleware);

catalogRouter.openapi(getCatalogBySlugRoute, getCatalogBySlugHandler);

export default catalogRouter;
