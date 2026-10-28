import type { z } from "@hono/zod-openapi";
import type {
	CreateBoardSchema,
	PaginateOptions,
} from "@scrum-board/shared/schemas";
import { HTTPException } from "hono/http-exception";
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
	data: z.infer<typeof CreateBoardSchema>;
};

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

	async create(userId: string, data: z.infer<typeof CreateBoardSchema>) {
		return await boardRepository.create({
			name: data.name,
			owner: {
				connect: {
					id: userId,
				},
			},
		});
	},

	async update(input: UpdateBoardInput) {
		const { id, userId, data } = input;
		const board = await boardRepository.findById({ id });
		if (!board) throw new HTTPException(404, { message: "Board not found" });
		if (board.ownerId !== userId)
			throw new HTTPException(403, { message: "Not authorized" });

		return boardRepository.update(id, data);
	},

	async remove(id: string, userId: string) {
		const board = await boardRepository.findById({ id });
		if (!board) throw new HTTPException(404, { message: "Board not found" });
		if (board.ownerId !== userId)
			throw new HTTPException(403, { message: "Not authorized" });

		return boardRepository.delete(id);
	},
};
