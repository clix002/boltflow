import { prisma } from "@/db/connections";
import type { Prisma } from "@/db/prisma/generated/client";

export const taskRepository = {
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
};
