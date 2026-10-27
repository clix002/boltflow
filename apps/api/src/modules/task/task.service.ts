import type { z } from "@hono/zod-openapi";
import type { CreateTaskSchema } from "@scrum-board/shared/schemas";
import { HTTPException } from "hono/http-exception";
import { prisma } from "@/db/connections";
import { Priority, Prisma } from "@/db/prisma/generated/client";
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

		const assigneeIds = [...new Set(data.assigneeIds ?? [])];
		if (assigneeIds.length) {
			const existingUsers = await prisma.user.findMany({
				where: { id: { in: assigneeIds } },
				select: { id: true },
			});
			if (existingUsers.length !== assigneeIds.length) {
				throw new HTTPException(400, {
					message: "One or more assignees do not exist",
				});
			}
		}

		const currentCount = await taskRepository.countByColumnId(data.columnId);
		const order = data.order ?? currentCount;
		const assignees = assigneeIds.map((id) => ({ id }));

		try {
			return await taskRepository.create({
				title: data.title,
				description: data.description,
				order,
				priority: data.priority ?? Priority.MEDIUM,
				columnId: data.columnId,
				assignees: {
					connect: assignees,
				},
			});
		} catch (err) {
			if (
				err instanceof Prisma.PrismaClientKnownRequestError &&
				(err.code === "P2003" || err.code === "P2025")
			) {
				throw new HTTPException(400, {
					message: "Column or assignee no longer exists",
				});
			}
			throw err;
		}
	},
};
