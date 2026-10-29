import type { z } from "@hono/zod-openapi";
import {
	type CreateBoardSchema,
	type CreateBoltInput,
	type CreateUnitInput,
	type PaginateOptions,
	trimToNull,
	type UpdateBoardSchema,
	type UpdateBoltInput,
	type UpdateUnitInput,
} from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { HTTPException } from "hono/http-exception";
import { githubService } from "../github/github.service";
import { normalizeRepoSlug, sanitizeBranchName } from "../github/github.utils";
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

type ResolveUnitBranchInput = {
	branchName?: Maybe<string>;
	createBranchOnGitHub?: boolean;
	board: {
		githubRepo: Maybe<string>;
		defaultBranch: string;
		owner?: {
			githubToken: Maybe<string>;
		};
	};
};

async function resolveUnitBranchName(
	input: ResolveUnitBranchInput,
): Promise<Maybe<string> | undefined> {
	const { branchName, createBranchOnGitHub, board } = input;
	if (branchName === undefined) return undefined;
	const cleanedBranch = trimToNull(branchName);
	if (!cleanedBranch) return null;

	if (!createBranchOnGitHub) {
		return cleanedBranch;
	}

	const sanitized = sanitizeBranchName(cleanedBranch);
	if (board.githubRepo) {
		await githubService.ensureBranchExists({
			githubRepo: board.githubRepo,
			defaultBranch: board.defaultBranch,
			baseBranch: board.defaultBranch,
			githubToken: board.owner?.githubToken,
			branchName: sanitized,
		});
	}
	return sanitized;
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
			githubToken: board.owner.githubToken,
		});
	},

	async create(userId: string, data: z.infer<typeof CreateBoardSchema>) {
		return await boardRepository.create({
			name: data.name,
			githubRepo: normalizeRepoSlug(data.githubRepo),
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

		return boardRepository.update(id, {
			...(data.name !== undefined ? { name: data.name } : {}),
			...(data.githubRepo !== undefined
				? { githubRepo: normalizeRepoSlug(data.githubRepo) }
				: {}),
			...(data.defaultBranch !== undefined
				? { defaultBranch: data.defaultBranch }
				: {}),
		});
	},

	async remove(id: string, userId: string) {
		await verifyBoardOwnership(id, userId);

		return boardRepository.delete(id);
	},

	async createUnit(input: CreateBoardUnitInput) {
		const { boardId, userId, data } = input;
		const board = await verifyBoardOwnership(boardId, userId);
		const branchName = await resolveUnitBranchName({
			branchName: data.branchName,
			createBranchOnGitHub: data.createBranchOnGitHub,
			board,
		});

		return boardRepository.createUnit({
			boardId,
			name: data.name,
			description: data.description ?? null,
			branchName: branchName ?? null,
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

		const branchName = await resolveUnitBranchName({
			branchName: data.branchName,
			createBranchOnGitHub: data.createBranchOnGitHub,
			board: unit.board,
		});

		const { createBranchOnGitHub: _ignore, ...updateFields } = data;

		return boardRepository.updateUnit(unitId, {
			...updateFields,
			...(branchName !== undefined ? { branchName } : {}),
		});
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
		const unit = await boardRepository.findUnitOwnershipById(data.unitId);
		if (!unit || unit.boardId !== boardId) {
			throw new HTTPException(404, { message: "Unit not found" });
		}
		if (unit.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		return boardRepository.createBolt({
			unitId: data.unitId,
			name: data.name,
			goal: data.goal ?? null,
			...(data.status ? { status: data.status } : {}),
		});
	},

	async updateBolt(input: UpdateBoardBoltInput) {
		const { boardId, boltId, userId, data } = input;
		const bolt = await boardRepository.findBoltOwnershipById(boltId);
		if (!bolt || bolt.unit.boardId !== boardId) {
			throw new HTTPException(404, { message: "Bolt not found" });
		}
		if (bolt.unit.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		return boardRepository.updateBolt(boltId, data);
	},

	async removeBolt(input: RemoveBoardBoltInput) {
		const { boardId, boltId, userId } = input;
		const bolt = await boardRepository.findBoltOwnershipById(boltId);
		if (!bolt || bolt.unit.boardId !== boardId) {
			throw new HTTPException(404, { message: "Bolt not found" });
		}
		if (bolt.unit.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		return boardRepository.deleteBolt(boltId);
	},
};
