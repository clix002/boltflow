import { move } from "@dnd-kit/helpers";
import type { DragOverEvent } from "@dnd-kit/react";
import type {
	BoardDetailResponseSchema,
	TaskWithAssigneesSchema,
} from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import type { z } from "zod";

type BoardDetail = z.infer<typeof BoardDetailResponseSchema>;
type Task = z.infer<typeof TaskWithAssigneesSchema>;

export function findTaskInBoard(
	board: BoardDetail,
	taskId: string,
): Maybe<Task> {
	for (const column of board.columns) {
		const task = column.tasks.find((t) => t.id === taskId);
		if (task) return task;
	}
	return null;
}

/**
 * Applies the dnd-kit `move` helper to the board, keeping each task's
 * `columnId` and `order` in sync with its new position.
 */
export function moveTaskInBoard(
	board: BoardDetail,
	event: DragOverEvent,
): BoardDetail {
	const tasksByColumn = Object.fromEntries(
		board.columns.map((column) => [column.id, column.tasks]),
	);
	const moved = move(tasksByColumn, event);
	if (moved === tasksByColumn) return board;

	return {
		...board,
		columns: board.columns.map((column) => ({
			...column,
			tasks: moved[column.id].map((task, order) => ({
				...task,
				columnId: column.id,
				order,
			})),
		})),
	};
}
