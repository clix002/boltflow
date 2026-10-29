import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import type {
	BoardDetailResponseSchema,
	ColumnWithTasksSchema,
	TaskWithAssigneesSchema,
} from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";
import { GitBranch, Plus, X, Zap } from "lucide-react";
import { useRef, useState } from "react";
import { useParams } from "react-router";
import type { z } from "zod";
import { ErrorState } from "@/components/state/error-state";
import { LoadingState } from "@/components/state/loading-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CARD_VARIANT } from "@/components/ui/card";
import {
	getBoardQueryKey,
	useGetBoardQuery,
} from "@/feature/board/api/use-get-board";
import { useDeleteColumnMutation } from "@/feature/column/api/use-delete-column";
import { CreateColumnDialog } from "@/feature/column/components/form/create-column-dialog";
import { UpdateColumnDialog } from "@/feature/column/components/form/update-column-dialog";
import { useDeleteTaskMutation } from "@/feature/task/api/use-delete-task";
import { useMoveTaskMutation } from "@/feature/task/api/use-move-task";
import { CreateTaskDialog } from "@/feature/task/components/form/create-task-dialog";
import { UpdateTaskDialog } from "@/feature/task/components/form/update-task-dialog";
import { TaskDetailSheet } from "@/feature/task/components/task-detail-sheet";
import { useConfirm } from "@/hooks/confirm-provider";
import { BoardTableView } from "./board-table";
import {
	createBoardDndHandlers,
	findTaskInBoard,
	resolveActiveUnit,
} from "./dnd.utils";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";
import { BOARD_VIEW_MODE } from "./types";
import { UnitSubboardBanner } from "./unit-subboard-banner";
import { useBoardPreferences } from "./use-board-preferences";

type BoardDetailData = z.infer<typeof BoardDetailResponseSchema>;
type ColumnWithTasks = z.infer<typeof ColumnWithTasksSchema>;
type TaskWithAssignees = z.infer<typeof TaskWithAssigneesSchema>;

export const BoardDetail = () => {
	const queryClient = useQueryClient();
	const { boardId } = useParams<{ boardId: string }>();
	const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
	const confirm = useConfirm();
	const { mutate: deleteColumn } = useDeleteColumnMutation();
	const { mutate: deleteTask } = useDeleteTaskMutation();
	const { mutate: moveTask } = useMoveTaskMutation();

	const {
		session,
		selectedColumnIds,
		currentView,
		toggleBolt,
		toggleBranch,
		clearContextFilters,
	} = useBoardPreferences();

	const boardFilters = {
		search: session.search,
		assigneeIds: session.assigneeIds.join(","),
		boltId: session.boltId,
		branchName: session.branchName,
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
	const [editingTask, setEditingTask] =
		useState<Maybe<TaskWithAssignees>>(null);
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

	const handleDeleteTask = async (taskId: string) => {
		const ok = await confirm({
			title: "Delete Task",
			message: "Are you sure you want to permanently delete this task?",
			confirmText: "Delete",
		});
		if (!ok) return;

		deleteTask(taskId, {
			onSuccess: () => {
				if (selectedTaskId === taskId) {
					setSelectedTaskId(null);
				}
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

	const activeUnit = resolveActiveUnit(board.units, session.unitId);
	const unitColumns = activeUnit?.columns ?? [];
	const unitBolts = activeUnit?.bolts ?? [];

	const matchingColumns = unitColumns.filter((c) =>
		selectedColumnIds.includes(c.id),
	);
	const visibleColumns = isEmpty(matchingColumns)
		? unitColumns
		: matchingColumns;

	const selectedTask = selectedTaskId
		? findTaskInBoard(board, selectedTaskId)
		: null;
	const selectedTaskColumn = selectedTask
		? unitColumns.find((col) => col.id === selectedTask.columnId)
		: undefined;

	const activeBolt = unitBolts.find((b) => b.id === session.boltId);

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
			{activeUnit && (
				<UnitSubboardBanner unit={activeUnit} githubRepo={board.githubRepo} />
			)}

			{(activeBolt || session.branchName) && (
				<div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-1.5 text-xs">
					<span className="font-medium text-muted-foreground">
						Active Filters:
					</span>
					{activeBolt && (
						<Badge variant="secondary" className="gap-1.5 pr-1">
							<Zap className="size-3 text-amber-500" />
							<span>{activeBolt.name}</span>
							<Button
								type="button"
								variant="ghost"
								size="icon-xs"
								className="size-4 rounded-full hover:bg-muted cursor-pointer"
								onClick={() => toggleBolt(activeBolt.id)}
							>
								<X className="size-2.5" />
							</Button>
						</Badge>
					)}
					{session.branchName && (
						<Badge variant="secondary" className="gap-1.5 font-mono pr-1">
							<GitBranch className="size-3 text-emerald-500" />
							<span>{session.branchName}</span>
							<Button
								type="button"
								variant="ghost"
								size="icon-xs"
								className="size-4 rounded-full hover:bg-muted cursor-pointer"
								onClick={() => toggleBranch(session.branchName)}
							>
								<X className="size-2.5" />
							</Button>
						</Badge>
					)}
					<Button
						type="button"
						variant="ghost"
						size="xs"
						className="ml-auto h-6 text-xs text-muted-foreground cursor-pointer"
						onClick={clearContextFilters}
					>
						Clear all
					</Button>
				</div>
			)}

			<DragDropProvider {...dndHandlers}>
				{currentView === BOARD_VIEW_MODE.LIST ? (
					<BoardTableView
						key={activeUnit?.id ?? boardId}
						columns={visibleColumns}
						onAddTask={(colId) => setActiveColumnId(colId)}
						onTaskClick={(taskId) => setSelectedTaskId(taskId)}
						onEditTask={(task) => setEditingTask(task)}
						onDeleteTask={handleDeleteTask}
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
								onEditTask={(task) => setEditingTask(task)}
								onDeleteTask={handleDeleteTask}
								onEditColumn={(col) => setEditingColumn(col)}
								onDeleteColumn={handleDeleteColumn}
							/>
						))}

						{activeUnit && unitColumns.length === 0 && (
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
				columns={unitColumns}
				bolts={unitBolts}
				boardId={boardId}
				columnName={selectedTaskColumn?.name}
				open={Boolean(selectedTask)}
				onOpenChange={(open) => !open && setSelectedTaskId(null)}
				onDeleteTask={handleDeleteTask}
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
			{editingTask && (
				<UpdateTaskDialog
					key={editingTask.id}
					open={Boolean(editingTask)}
					onOpenChange={(open) => !open && setEditingTask(null)}
					task={editingTask}
					boardId={boardId ?? ""}
				/>
			)}
			{activeUnit && (
				<CreateColumnDialog
					open={isAddColumnOpen}
					onOpenChange={setIsAddColumnOpen}
					boardId={boardId ?? ""}
					unitId={activeUnit.id}
				/>
			)}
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
