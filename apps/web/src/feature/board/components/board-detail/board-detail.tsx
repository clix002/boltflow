import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import type {
	BoardDetailResponseSchema,
	ColumnWithTasksSchema,
} from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useParams } from "react-router";
import type { z } from "zod";
import { ErrorState } from "@/components/state/error-state";
import { LoadingState } from "@/components/state/loading-state";
import { Button } from "@/components/ui/button";
import { CARD_VARIANT } from "@/components/ui/card";
import {
	getBoardQueryKey,
	useGetBoardQuery,
} from "@/feature/board/api/use-get-board";
import { useDeleteColumnMutation } from "@/feature/column/api/use-delete-column";
import { CreateColumnDialog } from "@/feature/column/components/form/create-column-dialog";
import { UpdateColumnDialog } from "@/feature/column/components/form/update-column-dialog";
import { useMoveTaskMutation } from "@/feature/task/api/use-move-task";
import { CreateTaskDialog } from "@/feature/task/components/form/create-task-dialog";
import { TaskDetailSheet } from "@/feature/task/components/task-detail-sheet";
import { useConfirm } from "@/hooks/confirm-provider";
import { BoardTableView } from "./board-table";
import { createBoardDndHandlers, findTaskInBoard } from "./dnd.utils";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";
import { BOARD_VIEW_MODE } from "./types";
import { useBoardPreferences } from "./use-board-preferences";

type BoardDetailData = z.infer<typeof BoardDetailResponseSchema>;
type ColumnWithTasks = z.infer<typeof ColumnWithTasksSchema>;

export const BoardDetail = () => {
	const queryClient = useQueryClient();
	const { boardId } = useParams<{ boardId: string }>();
	const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
	const confirm = useConfirm();
	const { mutate: deleteColumn } = useDeleteColumnMutation();
	const { mutate: moveTask } = useMoveTaskMutation();

	const { session, selectedColumnIds, currentView } = useBoardPreferences();

	const boardFilters = {
		search: session.search,
		assigneeIds: session.assigneeIds.join(","),
	};
	const boardQueryKey = getBoardQueryKey(boardId, boardFilters);
	const {
		data: board,
		isPending,
		isError,
		refetch,
	} = useGetBoardQuery(boardId, boardFilters);

	const boardBeforeDrag = useRef<Maybe<BoardDetailData>>(null);
	const [activeColumnId, setActiveColumnId] = useState<Maybe<string>>(null);
	const [selectedTaskId, setSelectedTaskId] = useState<Maybe<string>>(null);
	const [editingColumn, setEditingColumn] =
		useState<Maybe<ColumnWithTasks>>(null);

	const handleDeleteColumn = async (columnId: string) => {
		const ok = await confirm({
			title: "Delete Column",
			message:
				"This will permanently delete this column and all tasks inside it.",
			confirmText: "Delete",
		});
		if (!ok) return;

		deleteColumn(columnId, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["board", boardId] });
			},
		});
	};

	if (isPending) {
		return <LoadingState />;
	}

	if (isError || !board) {
		return (
			<ErrorState
				title="Failed to load board"
				description="Check if it exists or try again."
				onRetry={() => refetch()}
			/>
		);
	}

	const matchingColumns = board.columns.filter((c) =>
		selectedColumnIds.includes(c.id),
	);
	const visibleColumns = isEmpty(matchingColumns)
		? board.columns
		: matchingColumns;

	const selectedTask = selectedTaskId
		? findTaskInBoard(board, selectedTaskId)
		: null;
	const selectedTaskColumn = selectedTask
		? board.columns.find((col) => col.id === selectedTask.columnId)
		: undefined;

	const dndHandlers = createBoardDndHandlers({
		board,
		boardQueryKey,
		boardBeforeDragRef: boardBeforeDrag,
		queryClient,
		onPersistMove: ({ id, columnId, order }) => {
			moveTask(
				{ id, data: { columnId, order } },
				{
					onSettled: () =>
						queryClient.invalidateQueries({ queryKey: ["board", boardId] }),
				},
			);
		},
	});

	return (
		<div className="flex flex-1 flex-col overflow-hidden py-4">
			<DragDropProvider {...dndHandlers}>
				{currentView === BOARD_VIEW_MODE.LIST ? (
					<BoardTableView
						key={boardId}
						columns={visibleColumns}
						onAddTask={(colId) => setActiveColumnId(colId)}
						onTaskClick={(taskId) => setSelectedTaskId(taskId)}
						onEditColumn={(col) => setEditingColumn(col)}
						onDeleteColumn={handleDeleteColumn}
					/>
				) : (
					<div className="flex flex-1 items-start gap-4 overflow-x-auto min-h-0 w-full pb-3 pt-2 custom-scrollbar">
						{visibleColumns.map((column) => (
							<KanbanColumn
								key={column.id}
								column={column}
								onAddTask={(colId) => setActiveColumnId(colId)}
								onTaskClick={(taskId) => setSelectedTaskId(taskId)}
								onEditColumn={(col) => setEditingColumn(col)}
								onDeleteColumn={handleDeleteColumn}
							/>
						))}

						{board.columns.length === 0 && (
							<Button
								variant="outline"
								className="h-12 w-80 rounded-2xl border-dashed text-muted-foreground cursor-pointer"
								onClick={() => setIsAddColumnOpen(true)}
							>
								<Plus />
								Add column
							</Button>
						)}
					</div>
				)}

				<DragOverlay>
					{(source) => {
						const task = findTaskInBoard(board, String(source.id));
						return (
							task && <TaskCard task={task} variant={CARD_VARIANT.OVERLAY} />
						);
					}}
				</DragOverlay>
			</DragDropProvider>

			<TaskDetailSheet
				task={selectedTask}
				boardId={boardId}
				columnName={selectedTaskColumn?.name}
				open={Boolean(selectedTask)}
				onOpenChange={(open) => !open && setSelectedTaskId(null)}
			/>

			{Boolean(activeColumnId) && (
				<CreateTaskDialog
					key={activeColumnId}
					open={Boolean(activeColumnId)}
					onOpenChange={(open) => !open && setActiveColumnId(null)}
					columnId={activeColumnId}
					boardId={boardId ?? ""}
				/>
			)}
			<CreateColumnDialog
				open={isAddColumnOpen}
				onOpenChange={setIsAddColumnOpen}
				boardId={boardId ?? ""}
			/>
			{editingColumn && (
				<UpdateColumnDialog
					open={Boolean(editingColumn)}
					onOpenChange={(open) => !open && setEditingColumn(null)}
					column={editingColumn}
					boardId={boardId ?? ""}
				/>
			)}
		</div>
	);
};
