import type { RouteHandler } from "@hono/zod-openapi";
import type { AppEnv } from "@/modules/auth/types";
import type {
	connectGitHubTokenRoute,
	listRepoBranchesRoute,
	listUserGitHubReposRoute,
} from "./github.routes";
import { githubService } from "./github.service";

export const listUserReposHandler: RouteHandler<
	typeof listUserGitHubReposRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const result = await githubService.listUserRepos(userId);
	return c.json(result, 200);
};

export const connectTokenHandler: RouteHandler<
	typeof connectGitHubTokenRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const { githubToken } = c.req.valid("json");
	const result = await githubService.connectUserToken(userId, githubToken);
	return c.json(result, 200);
};

export const listRepoBranchesHandler: RouteHandler<
	typeof listRepoBranchesRoute,
	AppEnv
> = async (c) => {
	const userId = c.get("jwtPayload").id;
	const { repo } = c.req.valid("query");
	const result = await githubService.listRepoBranches(userId, repo);
	return c.json(result, 200);
};
