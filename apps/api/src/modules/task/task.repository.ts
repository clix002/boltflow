import { prisma } from "@/db/connections";
import type { Prisma } from "@/db/prisma/generated/client";
import { getMoveShiftOperations, type MoveTaskParams } from "./task.reorder";

export type DeleteTaskParams = {
	id: string;
	columnId: string;
	order: number;
};

const TASK_RELATIONS_INCLUDE = {
	assignees: {
		select: {
			id: true,
			name: true,
			avatarUrl: true,
		},
	},
	bolt: {
		select: {
			id: true,
			name: true,
			status: true,
		},
	},
} satisfies Prisma.TaskInclude;

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
						unit: {
							select: {
								id: true,
								branchName: true,
								board: {
									select: {
										id: true,
										ownerId: true,
										githubRepo: true,
										defaultBranch: true,
										owner: {
											select: {
												githubToken: true,
											},
										},
									},
								},
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
			include: TASK_RELATIONS_INCLUDE,
		});
	},
	update(id: string, data: Prisma.TaskUncheckedUpdateInput) {
		return prisma.task.update({
			where: { id },
			data,
			include: TASK_RELATIONS_INCLUDE,
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
				include: TASK_RELATIONS_INCLUDE,
			});
		});
	},
	async deleteTask(params: DeleteTaskParams) {
		return prisma.$transaction(async (tx) => {
			await tx.task.delete({
				where: { id: params.id },
				select: { id: true },
			});

			await tx.task.updateMany({
				where: {
					columnId: params.columnId,
					order: { gt: params.order },
				},
				data: {
					order: { decrement: 1 },
				},
			});
		});
	},
};
