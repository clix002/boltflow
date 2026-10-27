import type { z } from "@hono/zod-openapi";
import type {
	CreateColumnSchema,
	UpdateColumnSchema,
} from "@scrum-board/shared/schemas";
import { HTTPException } from "hono/http-exception";
import { prisma } from "@/db/connections";
import { columnRepository } from "./column.repository";

export const columnService = {
	async create(userId: string, data: z.infer<typeof CreateColumnSchema>) {
		const board = await prisma.board.findUnique({
			where: { id: data.boardId },
			select: { id: true, ownerId: true },
		});

		if (!board) {
			throw new HTTPException(404, { message: "Board not found" });
		}

		if (board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		const currentCount = await columnRepository.countByBoardId(data.boardId);
		const order = data.order ?? currentCount;

		return columnRepository.create({
			name: data.name,
			boardId: data.boardId,
			order,
		});
	},

	async update(
		id: string,
		userId: string,
		data: z.infer<typeof UpdateColumnSchema>,
	) {
		const column = await columnRepository.findById(id);

		if (!column) {
			throw new HTTPException(404, { message: "Column not found" });
		}

		if (column.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		return columnRepository.update(id, data);
	},

	async remove(id: string, userId: string) {
		const column = await columnRepository.findById(id);

		if (!column) {
			throw new HTTPException(404, { message: "Column not found" });
		}

		if (column.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		return columnRepository.delete(id);
	},
};
