import type { z } from "@hono/zod-openapi";
import type {
	CreateTaskSchema,
	MoveTaskSchema,
	UpdateTaskSchema,
} from "@scrum-board/shared/schemas";
import { HTTPException } from "hono/http-exception";
import { prisma } from "@/db/connections";
import { Priority, Prisma } from "@/db/prisma/generated/client";
import { taskRepository } from "./task.repository";

export type UpdateTaskInput = {
	userId: string;
	id: string;
	data: z.infer<typeof UpdateTaskSchema>;
};

export type MoveTaskInput = {
	userId: string;
	id: string;
	data: z.infer<typeof MoveTaskSchema>;
};

export type RemoveTaskInput = {
	userId: string;
	id: string;
};

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

	async update(input: UpdateTaskInput) {
		const { userId, id, data } = input;
		const task = await taskRepository.findByIdWithBoard(id);
		if (!task) {
			throw new HTTPException(404, { message: "Task not found" });
		}

		if (task.column.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		const { assigneeIds, ...taskData } = data;

		return taskRepository.update(id, {
			...taskData,
			...(assigneeIds && {
				assignees: {
					set: [...new Set(assigneeIds)].map((assigneeId) => ({
						id: assigneeId,
					})),
				},
			}),
		});
	},

	async move(input: MoveTaskInput) {
		const { userId, id, data } = input;
		const task = await taskRepository.findByIdWithBoard(id);
		if (!task) {
			throw new HTTPException(404, { message: "Task not found" });
		}

		if (task.column.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		const isSameColumn = data.columnId === task.columnId;

		if (!isSameColumn) {
			const targetColumn = await prisma.column.findUnique({
				where: { id: data.columnId },
				select: {
					id: true,
					boardId: true,
				},
			});

			if (!targetColumn) {
				throw new HTTPException(404, { message: "Target column not found" });
			}

			if (targetColumn.boardId !== task.column.board.id) {
				throw new HTTPException(400, {
					message: "Cannot move task to a column in a different board",
				});
			}
		}

		const targetOrder =
			data.order ?? (await taskRepository.countByColumnId(data.columnId));

		return taskRepository.moveTask({
			id,
			sourceColumnId: task.columnId,
			sourceOrder: task.order,
			targetColumnId: data.columnId,
			targetOrder,
		});
	},

	async remove(input: RemoveTaskInput) {
		const { userId, id } = input;
		const task = await taskRepository.findByIdWithBoard(id);
		if (!task) {
			throw new HTTPException(404, { message: "Task not found" });
		}

		if (task.column.board.ownerId !== userId) {
			throw new HTTPException(403, { message: "Not authorized" });
		}

		await taskRepository.deleteTask({
			id,
			columnId: task.columnId,
			order: task.order,
		});
	},
};
