import { prisma } from "@/db/connections";
import type { Prisma } from "@/db/prisma/generated/client";

export const columnRepository = {
	countByUnitId(unitId: string) {
		return prisma.column.count({
			where: { unitId },
		});
	},
	findById(id: string) {
		return prisma.column.findUnique({
			where: { id },
			select: {
				id: true,
				unit: {
					select: {
						board: {
							select: { ownerId: true },
						},
					},
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
			select: { id: true },
		});
	},
};
