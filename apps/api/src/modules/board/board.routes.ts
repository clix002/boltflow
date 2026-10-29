import { createRoute, z } from "@hono/zod-openapi";
import {
	BoardDetailResponseSchema,
	BoardGitHubInfoSchema,
	BoardSchema,
	BoltSchema,
	CommaSeparatedArray,
	CreateBoardSchema,
	CreateBoltSchema,
	CreateUnitSchema,
	paginatedResponseOf,
	UnitSchema,
	UpdateBoardSchema,
	UpdateBoltSchema,
	UpdateUnitSchema,
} from "@scrum-board/shared/schemas";

const ParamsSchema = z.object({
	id: z.string().openapi({
		param: {
			name: "id",
			in: "path",
		},
	}),
});

const UnitParamsSchema = ParamsSchema.extend({
	unitId: z.string().openapi({
		param: {
			name: "unitId",
			in: "path",
		},
	}),
});

const BoltParamsSchema = ParamsSchema.extend({
	boltId: z.string().openapi({
		param: {
			name: "boltId",
			in: "path",
		},
	}),
});

const BoardDetailQuerySchema = z.object({
	search: z.string().optional(),
	assigneeIds: CommaSeparatedArray,
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

export const createBoardUnitRoute = createRoute({
	method: "post",
	tags: ["Board", "Unit"],
	path: "/{id}/units",
	request: {
		params: ParamsSchema,
		body: {
			content: { "application/json": { schema: CreateUnitSchema } },
		},
	},
	responses: {
		201: {
			description: "Unit of Work created successfully",
			content: { "application/json": { schema: UnitSchema } },
		},
	},
});

export const updateBoardUnitRoute = createRoute({
	method: "patch",
	tags: ["Board", "Unit"],
	path: "/{id}/units/{unitId}",
	request: {
		params: UnitParamsSchema,
		body: {
			content: { "application/json": { schema: UpdateUnitSchema } },
		},
	},
	responses: {
		200: {
			description: "Unit of Work updated successfully",
			content: { "application/json": { schema: UnitSchema } },
		},
	},
});

export const deleteBoardUnitRoute = createRoute({
	method: "delete",
	tags: ["Board", "Unit"],
	path: "/{id}/units/{unitId}",
	request: {
		params: UnitParamsSchema,
	},
	responses: {
		204: {
			description: "Unit of Work deleted successfully",
		},
	},
});

export const createBoardBoltRoute = createRoute({
	method: "post",
	tags: ["Board", "Bolt"],
	path: "/{id}/bolts",
	request: {
		params: ParamsSchema,
		body: {
			content: { "application/json": { schema: CreateBoltSchema } },
		},
	},
	responses: {
		201: {
			description: "Bolt created successfully",
			content: { "application/json": { schema: BoltSchema } },
		},
	},
});

export const updateBoardBoltRoute = createRoute({
	method: "patch",
	tags: ["Board", "Bolt"],
	path: "/{id}/bolts/{boltId}",
	request: {
		params: BoltParamsSchema,
		body: {
			content: { "application/json": { schema: UpdateBoltSchema } },
		},
	},
	responses: {
		200: {
			description: "Bolt updated successfully",
			content: { "application/json": { schema: BoltSchema } },
		},
	},
});

export const deleteBoardBoltRoute = createRoute({
	method: "delete",
	tags: ["Board", "Bolt"],
	path: "/{id}/bolts/{boltId}",
	request: {
		params: BoltParamsSchema,
	},
	responses: {
		204: {
			description: "Bolt deleted successfully",
		},
	},
});
