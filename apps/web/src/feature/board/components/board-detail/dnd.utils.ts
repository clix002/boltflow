import type { BoardDetailResponseSchema } from "@scrum-board/shared/schemas";
import type { z } from "zod";

type BoardDetail = z.infer<typeof BoardDetailResponseSchema>;

export type DropTargetResolution = {
	columnId: string;
	order: number;
};

export function findTaskInBoard(board: BoardDetail, taskId: string) {
	for (const column of board.columns) {
		const task = column.tasks.find((t) => t.id === taskId);
		if (task) return task;
	}
	return null;
}

export function resolveDropPosition(
	board: BoardDetail,
	targetId: string,
): DropTargetResolution | null {
	for (const column of board.columns) {
		if (column.id === targetId) {
			return {
				columnId: column.id,
				order: column.tasks.length,
			};
		}

		const task = column.tasks.find((t) => t.id === targetId);
		if (task) {
			return {
				columnId: task.columnId,
				order: task.order,
			};
		}
	}

	return null;
}
