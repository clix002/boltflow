import { createRoute, z } from "@hono/zod-openapi";
import {
	BoardDetailResponseSchema,
	BoardGitHubInfoSchema,
	BoardSchema,
	CommaSeparatedArray,
	CreateBoardSchema,
	paginatedResponseOf,
	UpdateBoardSchema,
} from "@scrum-board/shared/schemas";

const ParamsSchema = z.object({
	id: z.string().openapi({
		param: {
			name: "id",
			in: "path",
		},
	}),
});

const BoardDetailQuerySchema = z.object({
	search: z.string().optional(),
	assigneeIds: CommaSeparatedArray,
	unitId: z.string().optional(),
	boltId: z.string().optional(),
	branchName: z.string().optional(),
});

export const listBoardsRoute = createRoute({
	method: "get",
	tags: ["Board"],
	path: "/",
	responses: {
		200: {
			description: "List of boards for the authenticated user",
			content: {
				"application/json": {
					schema: paginatedResponseOf(BoardSchema),
				},
			},
		},
	},
});

export const getBoardByIdRoute = createRoute({
	method: "get",
	tags: ["Board"],
	path: "/{id}",
	request: {
		params: ParamsSchema,
		query: BoardDetailQuerySchema,
	},
	responses: {
		200: {
			description: "Board details for the authenticated user",
			content: {
				"application/json": {
					schema: BoardDetailResponseSchema,
				},
			},
		},
	},
});

export const getBoardGitHubBranchesRoute = createRoute({
	method: "get",
	tags: ["Board", "GitHub"],
	path: "/{id}/github/branches",
	request: {
		params: ParamsSchema,
	},
	responses: {
		200: {
			description: "GitHub branches and repository connection status for board",
			content: {
				"application/json": {
					schema: BoardGitHubInfoSchema,
				},
			},
		},
	},
});

export const createBoardRoute = createRoute({
	method: "post",
	tags: ["Board"],
	path: "/",
	request: {
		body: {
			content: { "application/json": { schema: CreateBoardSchema } },
		},
	},
	responses: {
		201: {
			description: "Board created successfully",
			content: { "application/json": { schema: BoardSchema } },
		},
	},
});

export const updateBoardRoute = createRoute({
	method: "put",
	tags: ["Board"],
	path: "/{id}",
	request: {
		params: ParamsSchema,
		body: {
			content: { "application/json": { schema: UpdateBoardSchema } },
		},
	},
	responses: {
		200: {
			description: "Board updated successfully",
			content: { "application/json": { schema: BoardSchema } },
		},
	},
});

export const deleteBoardRoute = createRoute({
	method: "delete",
	tags: ["Board"],
	path: "/{id}",
	request: { params: ParamsSchema },
	responses: {
		204: {
			description: "Board deleted successfully",
		},
	},
});
