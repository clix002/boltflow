import type { Prisma } from "@/db/prisma/generated/client";

export type MoveTaskParams = {
	id: string;
	sourceColumnId: string;
	sourceOrder: number;
	targetColumnId: string;
	targetOrder: number;
};

export function getMoveShiftOperations({
	sourceColumnId,
	sourceOrder,
	targetColumnId,
	targetOrder,
}: Omit<MoveTaskParams, "id">): Prisma.TaskUpdateManyArgs[] {
	if (sourceColumnId === targetColumnId) {
		if (sourceOrder === targetOrder) return [];

		const isMovingDown = sourceOrder < targetOrder;
		return [
			{
				where: {
					columnId: sourceColumnId,
					order: isMovingDown
						? { gt: sourceOrder, lte: targetOrder }
						: { gte: targetOrder, lt: sourceOrder },
				},
				data: {
					order: isMovingDown ? { decrement: 1 } : { increment: 1 },
				},
			},
		] satisfies Prisma.TaskUpdateManyArgs[];
	}

	return [
		// 1. Cerrar hueco en columna origen
		{
			where: {
				columnId: sourceColumnId,
				order: { gt: sourceOrder },
			},
			data: { order: { decrement: 1 } },
		},
		// 2. Abrir espacio en columna destino
		{
			where: {
				columnId: targetColumnId,
				order: { gte: targetOrder },
			},
			data: { order: { increment: 1 } },
		},
	] satisfies Prisma.TaskUpdateManyArgs[];
}
