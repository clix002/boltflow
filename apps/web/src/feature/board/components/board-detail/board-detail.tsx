import {
	DragDropProvider,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
} from "@dnd-kit/react";
import type {
	ColumnWithTasksSchema,
	TaskWithAssigneesSchema,
} from "@scrum-board/shared/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import type { z } from "zod";
import { ErrorState } from "@/components/state/error-state";
import { LoadingState } from "@/components/state/loading-state";
import { Button } from "@/components/ui/button";
import { useGetBoardQuery } from "@/feature/board/api/use-get-board";
import { useDeleteColumnMutation } from "@/feature/column/api/use-delete-column";
import { CreateColumnDialog } from "@/feature/column/components/form/create-column-dialog";
import { UpdateColumnDialog } from "@/feature/column/components/form/update-column-dialog";
import { useMoveTaskMutation } from "@/feature/task/api/use-move-task";
import { CreateTaskDialog } from "@/feature/task/components/form/create-task-dialog";
import { useConfirm } from "@/hooks/confirm-provider";
import { BoardTableView } from "./board-table";
import { findTaskInBoard, resolveDropPosition } from "./dnd.utils";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";
import { BOARD_VIEW_MODE } from "./types";
import { useBoardPreferences } from "./use-board-preferences";

type ColumnWithTasks = z.infer<typeof ColumnWithTasksSchema>;
type TaskWithAssignees = z.infer<typeof TaskWithAssigneesSchema>;

export const BoardDetail = () => {
	const queryClient = useQueryClient();
	const { boardId } = useParams<{ boardId: string }>();
	const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
	const confirm = useConfirm();
	const { mutate: deleteColumn } = useDeleteColumnMutation();
	const { mutate: moveTask } = useMoveTaskMutation();

	const { session, selectedColumnIds, currentView } = useBoardPreferences();

	const {
		data: board,
		isPending,
		isError,
		refetch,
	} = useGetBoardQuery(boardId, {
		search: session.search,
		assigneeIds: session.assigneeIds.join(","),
	});

	const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
	const [editingColumn, setEditingColumn] = useState<ColumnWithTasks | null>(
		null,
	);
	const [activeTask, setActiveTask] = useState<TaskWithAssignees | null>(null);

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

	const handleDragEnd = ({ operation }: DragEndEvent) => {
		const { source, target } = operation;
		setActiveTask(null);

		if (!source || !target || !board) return;

		const taskId = String(source.id);
		const drop = resolveDropPosition(board, String(target.id));
		if (!drop) return;

		const currentTask = findTaskInBoard(board, taskId);
		if (!currentTask) return;

		if (
			currentTask.columnId === drop.columnId &&
			currentTask.order === drop.order
		) {
			return;
		}

		moveTask(
			{
				id: currentTask.id,
				data: {
					columnId: drop.columnId,
					order: drop.order,
				},
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["board", boardId] });
				},
			},
		);
	};

	return (
		<div className="flex flex-1 flex-col overflow-hidden py-4">
			{currentView === BOARD_VIEW_MODE.LIST ? (
				<BoardTableView
					key={boardId}
					columns={visibleColumns}
					onAddTask={(colId) => setActiveColumnId(colId)}
					onTaskClick={() => {}}
					onEditColumn={(col) => setEditingColumn(col)}
					onDeleteColumn={handleDeleteColumn}
				/>
			) : (
				<DragDropProvider
					onDragStart={({ operation }: DragStartEvent) => {
						if (!operation.source || !board) return;
						const id = String(operation.source.id);
						const task = findTaskInBoard(board, id);
						setActiveTask(task);
					}}
					onDragEnd={handleDragEnd}
				>
					<div className="flex flex-1 items-start gap-4 overflow-x-auto min-h-0 w-full pb-3 pt-2 custom-scrollbar">
						{visibleColumns.map((column) => (
							<KanbanColumn
								key={column.id}
								column={column}
								onAddTask={(colId) => setActiveColumnId(colId)}
								onTaskClick={() => {}}
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

					<DragOverlay>
						{activeTask && <TaskCard task={activeTask} variant="overlay" />}
					</DragOverlay>
				</DragDropProvider>
			)}

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
