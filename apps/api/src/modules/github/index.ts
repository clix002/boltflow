import { createRouter } from "@/lib/openapi";
import { authMiddleware } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/modules/auth/types";
import {
	connectTokenHandler,
	listRepoBranchesHandler,
	listUserReposHandler,
} from "./github.handlers";
import {
	connectGitHubTokenRoute,
	listRepoBranchesRoute,
	listUserGitHubReposRoute,
} from "./github.routes";

const githubRouter = createRouter<AppEnv>();
githubRouter.use("*", authMiddleware);

githubRouter.openapi(listUserGitHubReposRoute, listUserReposHandler);
githubRouter.openapi(connectGitHubTokenRoute, connectTokenHandler);
githubRouter.openapi(listRepoBranchesRoute, listRepoBranchesHandler);

export default githubRouter;
