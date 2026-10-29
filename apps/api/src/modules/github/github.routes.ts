import { createRoute, z } from "@hono/zod-openapi";
import {
	BoardGitHubInfoSchema,
	ConnectGitHubTokenSchema,
	UserGitHubReposResponseSchema,
} from "@scrum-board/shared/schemas";

const RepoBranchesQuerySchema = z.object({
	repo: z.string().trim().min(1).max(200),
});

export const listUserGitHubReposRoute = createRoute({
	method: "get",
	tags: ["GitHub"],
	path: "/repos",
	responses: {
		200: {
			description: "List GitHub repositories accessible by the user token",
			content: {
				"application/json": {
					schema: UserGitHubReposResponseSchema,
				},
			},
		},
	},
});

export const connectGitHubTokenRoute = createRoute({
	method: "post",
	tags: ["GitHub"],
	path: "/token",
	request: {
		body: {
			content: {
				"application/json": {
					schema: ConnectGitHubTokenSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "Validate and store GitHub PAT and return user repositories",
			content: {
				"application/json": {
					schema: UserGitHubReposResponseSchema,
				},
			},
		},
	},
});

export const listRepoBranchesRoute = createRoute({
	method: "get",
	tags: ["GitHub"],
	path: "/repos/branches",
	request: {
		query: RepoBranchesQuerySchema,
	},
	responses: {
		200: {
			description: "List branches for a specific GitHub repository",
			content: {
				"application/json": {
					schema: BoardGitHubInfoSchema,
				},
			},
		},
	},
});
