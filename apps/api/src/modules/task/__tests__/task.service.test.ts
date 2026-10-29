import { describe, expect, it, mock } from "bun:test";
import { Prisma } from "@/db/prisma/generated/client";

const findColumn = mock(async () => ({
	id: "column-1",
	unitId: "unit-1",
	unit: {
		boardId: "board-1",
		board: { ownerId: "owner-1" },
	},
}));
const findUsers = mock(async () => [{ id: "user-1" }]);
const countTasks = mock(async () => 0);
const createTask = mock(async () => ({}));

mock.module("@/db/connections", () => ({
	prisma: {
		column: { findUnique: findColumn },
		user: { findMany: findUsers },
	},
}));
mock.module("../task.repository", () => ({
	taskRepository: {
		countByColumnId: countTasks,
		create: createTask,
	},
}));

const { taskService } =
	require("../task.service") as typeof import("../task.service");

describe("task.service.create", () => {
	it("accepts duplicate assignee IDs and connects each user once", async () => {
		await taskService.create("owner-1", {
			title: "Task",
			columnId: "column-1",
			assigneeIds: ["user-1", "user-1"],
		});

		expect(findUsers).toHaveBeenCalledWith({
			where: { id: { in: ["user-1"] } },
			select: { id: true },
		});
		expect(createTask).toHaveBeenCalledWith(
			expect.objectContaining({
				assignees: { connect: [{ id: "user-1" }] },
			}),
		);
	});

	it("returns 400 if a referenced record disappears before create", async () => {
		const missingRecord = new Prisma.PrismaClientKnownRequestError(
			"Record missing",
			{
				code: "P2025",
				clientVersion: "7.8.0",
			},
		);
		createTask.mockRejectedValueOnce(missingRecord);

		await expect(
			taskService.create("owner-1", {
				title: "Task",
				columnId: "column-1",
				assigneeIds: ["user-1"],
			}),
		).rejects.toMatchObject({ status: 400 });
	});
});
