import type { z } from "@hono/zod-openapi";
import type {
	CreateBoardSchema,
	CreateBoltInput,
	CreateUnitInput,
	PaginateOptions,
	UpdateBoardSchema,
	UpdateBoltInput,
	UpdateUnitInput,
} from "@scrum-board/shared/schemas";
import { HTTPException } from "hono/http-exception";
import { env } from "@/config/env";
import { githubService } from "../github/github.service";
import type { TaskFilterParams } from "../task/task.filters";
import { boardRepository } from "./board.repository";

export type GetBoardInput = {
	id: string;
	userId: string;
	filters?: TaskFilterParams;
};

export type UpdateBoardInput = {
	id: string;
	userId: string;
	data: z.infer<typeof UpdateBoardSchema>;
};

export type CreateBoardUnitInput = {
	boardId: string;
	userId: string;
	data: CreateUnitInput;
};

export type UpdateBoardUnitInput = {
	boardId: string;
	unitId: string;
	userId: string;
	data: UpdateUnitInput;
};

export type RemoveBoardUnitInput = {
	boardId: string;
	unitId: string;
	userId: string;
};

export type CreateBoardBoltInput = {
	boardId: string;
	userId: string;
	data: CreateBoltInput;
};

export type UpdateBoardBoltInput = {
	boardId: string;
	boltId: string;
	userId: string;
	data: UpdateBoltInput;
};

export type RemoveBoardBoltInput = {
	boardId: string;
	boltId: string;
	userId: string;
};

async function verifyBoardOwnership(boardId: string, userId: string) {
	const board = await boardRepository.findOwnershipById(boardId);
	if (!board) throw new HTTPException(404, { message: "Board not found" });
	if (board.ownerId !== userId)
		throw new HTTPException(403, { message: "Not authorized" });
	return board;
}

export const boardService = {
	listByUser(userId: string, options: PaginateOptions) {
		return boardRepository.findPaginatedByUserId({ userId, options });
	},
	async getById(input: GetBoardInput) {
		const { id, userId, filters = {} } = input;
		const board = await boardRepository.findById({ id, filters });
		if (!board) throw new HTTPException(404, { message: "Board not found" });
		if (board.ownerId !== userId)
			throw new HTTPException(403, { message: "Not authorized" });
		return board;
	},

	async getGitHubInfo(input: GetBoardInput) {
		const board = await verifyBoardOwnership(input.id, input.userId);
		return githubService.getBoardGitHubInfo({
			githubRepo: board.githubRepo,
			defaultBranch: board.defaultBranch,
		});
	},

	async create(userId: string, data: z.infer<typeof CreateBoardSchema>) {
		return await boardRepository.create({
			name: data.name,
			githubRepo: data.githubRepo ?? env.GITHUB_REPO ?? null,
			defaultBranch: data.defaultBranch ?? "main",
			owner: {
				connect: {
					id: userId,
				},
			},
		});
	},

	async update(input: UpdateBoardInput) {
		const { id, userId, data } = input;
		await verifyBoardOwnership(id, userId);

		return boardRepository.update(id, data);
	},

	async remove(id: string, userId: string) {
		await verifyBoardOwnership(id, userId);

		return boardRepository.delete(id);
	},

	async createUnit(input: CreateBoardUnitInput) {
		const { boardId, userId, data } = input;
		await verifyBoardOwnership(boardId, userId);

		return boardRepository.createUnit({
			boardId,
			name: data.name,
			description: data.description ?? null,
			...(data.color ? { color: data.color } : {}),
		});
	},

	async updateUnit(input: UpdateBoardUnitInput) {
		const { boardId, unitId, userId, data } = input;
		const unit = await boardRepository.findUnitOwnershipById(unitId);
		if (!unit || unit.boardId !== boardId) {
			throw new HTTPException(404, { message: "Unit not found" });
		}
		if (unit.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		return boardRepository.updateUnit(unitId, data);
	},

	async removeUnit(input: RemoveBoardUnitInput) {
		const { boardId, unitId, userId } = input;
		const unit = await boardRepository.findUnitOwnershipById(unitId);
		if (!unit || unit.boardId !== boardId) {
			throw new HTTPException(404, { message: "Unit not found" });
		}
		if (unit.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		return boardRepository.deleteUnit(unitId);
	},

	async createBolt(input: CreateBoardBoltInput) {
		const { boardId, userId, data } = input;
		await verifyBoardOwnership(boardId, userId);

		return boardRepository.createBolt({
			boardId,
			name: data.name,
			goal: data.goal ?? null,
			...(data.status ? { status: data.status } : {}),
		});
	},

	async updateBolt(input: UpdateBoardBoltInput) {
		const { boardId, boltId, userId, data } = input;
		const bolt = await boardRepository.findBoltOwnershipById(boltId);
		if (!bolt || bolt.boardId !== boardId) {
			throw new HTTPException(404, { message: "Bolt not found" });
		}
		if (bolt.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		return boardRepository.updateBolt(boltId, data);
	},

	async removeBolt(input: RemoveBoardBoltInput) {
		const { boardId, boltId, userId } = input;
		const bolt = await boardRepository.findBoltOwnershipById(boltId);
		if (!bolt || bolt.boardId !== boardId) {
			throw new HTTPException(404, { message: "Bolt not found" });
		}
		if (bolt.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		return boardRepository.deleteBolt(boltId);
	},
};
