import type { z } from "@hono/zod-openapi";
import type { CreateTaskSchema } from "@scrum-board/shared/schemas";
import { HTTPException } from "hono/http-exception";
import { prisma } from "@/db/connections";
import { Priority } from "@/db/prisma/generated/client";
import { taskRepository } from "./task.repository";

export const taskService = {
	async create(userId: string, data: z.infer<typeof CreateTaskSchema>) {
		const column = await prisma.column.findUnique({
			where: { id: data.columnId },
			select: {
				id: true,
				board: {
					select: {
						ownerId: true,
					},
				},
			},
		});

		if (!column) {
			throw new HTTPException(404, { message: "Column not found" });
		}

		if (column.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		const currentCount = await taskRepository.countByColumnId(data.columnId);
		const order = data.order ?? currentCount;
		const assignees = data.assigneeIds?.map((id) => ({ id })) ?? [];

		return taskRepository.create({
			title: data.title,
			description: data.description,
			order,
			priority: data.priority ?? Priority.MEDIUM,
			columnId: data.columnId,
			assignees: {
				connect: assignees,
			},
		});
	},
};
