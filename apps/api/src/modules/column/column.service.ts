import type { z } from "@hono/zod-openapi";
import type {
	CreateColumnSchema,
	UpdateColumnSchema,
} from "@scrum-board/shared/schemas";
import { HTTPException } from "hono/http-exception";
import { prisma } from "@/db/connections";
import { columnRepository } from "./column.repository";

export type UpdateColumnInput = {
	id: string;
	userId: string;
	data: z.infer<typeof UpdateColumnSchema>;
};

export const columnService = {
	async create(userId: string, data: z.infer<typeof CreateColumnSchema>) {
		const unit = await prisma.unit.findUnique({
			where: { id: data.unitId },
			select: {
				id: true,
				board: {
					select: { ownerId: true },
				},
			},
		});

		if (!unit) {
			throw new HTTPException(404, { message: "Unit not found" });
		}

		if (unit.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		const currentCount = await columnRepository.countByUnitId(data.unitId);
		const order = data.order ?? currentCount;

		return columnRepository.create({
			name: data.name,
			unitId: data.unitId,
			order,
		});
	},

	async update(input: UpdateColumnInput) {
		const { id, userId, data } = input;
		const column = await columnRepository.findById(id);

		if (!column) {
			throw new HTTPException(404, { message: "Column not found" });
		}

		if (column.unit.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		return columnRepository.update(id, data);
	},

	async remove(id: string, userId: string) {
		const column = await columnRepository.findById(id);

		if (!column) {
			throw new HTTPException(404, { message: "Column not found" });
		}

		if (column.unit.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		return columnRepository.delete(id);
	},
};
