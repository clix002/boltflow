import { prisma } from "@/db/connections";
import type { Prisma } from "@/db/prisma/generated/client";
import { getMoveShiftOperations, type MoveTaskParams } from "./task.reorder";

export const taskRepository = {
	findByIdWithBoard(id: string) {
		return prisma.task.findUnique({
			where: { id },
			select: {
				id: true,
				columnId: true,
				order: true,
				column: {
					select: {
						id: true,
						board: {
							select: {
								id: true,
								ownerId: true,
							},
						},
					},
				},
			},
		});
	},
	countByColumnId(columnId: string) {
		return prisma.task.count({
			where: { columnId },
		});
	},
	create(data: Prisma.TaskUncheckedCreateInput) {
		return prisma.task.create({
			data,
			include: {
				assignees: {
					select: {
						id: true,
						name: true,
						avatarUrl: true,
					},
				},
			},
		});
	},
	update(id: string, data: Prisma.TaskUncheckedUpdateInput) {
		return prisma.task.update({
			where: { id },
			data,
			include: {
				assignees: {
					select: {
						id: true,
						name: true,
						avatarUrl: true,
					},
				},
			},
		});
	},
	async moveTask(params: MoveTaskParams) {
		const shifts = getMoveShiftOperations(params);

		return prisma.$transaction(async (tx) => {
			for (const shift of shifts) {
				await tx.task.updateMany(shift);
			}

			return tx.task.update({
				where: { id: params.id },
				data: {
					columnId: params.targetColumnId,
					order: params.targetOrder,
				},
				include: {
					assignees: {
						select: {
							id: true,
							name: true,
							avatarUrl: true,
						},
					},
				},
			});
		});
	},
};
