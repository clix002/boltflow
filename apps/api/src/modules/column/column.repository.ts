import { prisma } from "@/db/connections";
import type { Prisma } from "@/db/prisma/generated/client";

export const columnRepository = {
	countByBoardId(boardId: string) {
		return prisma.column.count({
			where: { boardId },
		});
	},
	findById(id: string) {
		return prisma.column.findUnique({
			where: { id },
			include: {
				board: {
					select: { ownerId: true },
				},
			},
		});
	},
	create(data: Prisma.ColumnUncheckedCreateInput) {
		return prisma.column.create({
			data,
		});
	},
	update(id: string, data: Prisma.ColumnUpdateInput) {
		return prisma.column.update({
			where: { id },
			data,
		});
	},
	delete(id: string) {
		return prisma.column.delete({
			where: { id },
		});
	},
};
