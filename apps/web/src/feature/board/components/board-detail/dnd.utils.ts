import { move } from "@dnd-kit/helpers";
import type { DragEndEvent, DragOverEvent } from "@dnd-kit/react";
import type {
	BoardDetailResponseSchema,
	TaskWithAssigneesSchema,
} from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import type { QueryClient } from "@tanstack/react-query";
import type { z } from "zod";
import { playTaskMoveSound } from "@/lib/sound.utils";

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

export type PersistTaskMoveInput = {
	id: string;
	columnId: string;
	order: number;
};

export type CreateBoardDndHandlersInput = {
	board: BoardDetail;
	boardQueryKey: readonly unknown[];
	boardBeforeDragRef: { current: Maybe<BoardDetail> };
	queryClient: QueryClient;
	onPersistMove: (input: PersistTaskMoveInput) => void;
};

export function createBoardDndHandlers(input: CreateBoardDndHandlersInput) {
	const {
		board,
		boardQueryKey,
		boardBeforeDragRef,
		queryClient,
		onPersistMove,
	} = input;

	const onDragStart = () => {
		boardBeforeDragRef.current = board;
	};

	const onDragOver = (event: DragOverEvent) => {
		queryClient.setQueryData<BoardDetail>(
			boardQueryKey,
			(current) => current && moveTaskInBoard(current, event),
		);
	};

	const onDragEnd = (event: DragEndEvent) => {
		const previousBoard = boardBeforeDragRef.current;
		boardBeforeDragRef.current = null;
		const { source } = event.operation;
		if (!previousBoard || !source) return;

		if (event.canceled) {
			queryClient.setQueryData(boardQueryKey, previousBoard);
			return;
		}

		const currentBoard = queryClient.getQueryData<BoardDetail>(boardQueryKey);
		if (!currentBoard) return;

		const taskId = String(source.id);
		const before = findTaskInBoard(previousBoard, taskId);
		const after = findTaskInBoard(currentBoard, taskId);
		if (!before || !after) return;
		if (before.columnId === after.columnId && before.order === after.order) {
			return;
		}

		playTaskMoveSound();
		onPersistMove({
			id: taskId,
			columnId: after.columnId,
			order: after.order,
		});
	};

	return {
		onDragStart,
		onDragOver,
		onDragEnd,
	};
}
