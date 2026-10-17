import type { ColumnWithTasksSchema } from "@scrum-board/shared/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router";
import type { z } from "zod";
import { ErrorState } from "@/components/state/error-state";
import { LoadingState } from "@/components/state/loading-state";
import { Button } from "@/components/ui/button";
import { useGetBoardQuery } from "@/feature/board/api/use-get-board";
import { useDeleteColumnMutation } from "@/feature/column/api/use-delete-column";
import { CreateColumnDialog } from "@/feature/column/components/form/create-column-dialog";
import { UpdateColumnDialog } from "@/feature/column/components/form/update-column-dialog";
import { CreateTaskDialog } from "@/feature/task/components/form/create-task-dialog";
import { useConfirm } from "@/hooks/confirm-provider";
import { KanbanColumn } from "./kanban-column";

export const BoardDetail = () => {
	const queryClient = useQueryClient();
	const { boardId } = useParams<{ boardId: string }>();
	const [searchParams] = useSearchParams();
	const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
	const confirm = useConfirm();
	const { mutate: deleteColumn } = useDeleteColumnMutation();
	const {
		data: board,
		isPending,
		isError,
		refetch,
	} = useGetBoardQuery(boardId, searchParams);
	const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

	const [editingColumn, setEditingColumn] = useState<z.infer<
		typeof ColumnWithTasksSchema
	> | null>(null);

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

	return (
		<div className="flex flex-1 flex-col overflow-hidden py-4">
			<div className="flex flex-1 items-start gap-4 overflow-x-auto min-h-0 w-full pb-3 pt-2 custom-scrollbar">
				{board.columns.map((column) => (
					<KanbanColumn
						key={column.id}
						column={column}
						onAddTask={(colId) => setActiveColumnId(colId)}
						onTaskClick={() => () => {}}
						onEditColumn={(col) => setEditingColumn(col)}
						onDeleteColumn={handleDeleteColumn}
					/>
				))}

				<Button
					variant="outline"
					className="h-12 w-80 rounded-2xl border-dashed text-muted-foreground cursor-pointer"
					onClick={() => setIsAddColumnOpen(true)}
				>
					<Plus />
					Add column
				</Button>
			</div>

			<CreateTaskDialog
				open={Boolean(activeColumnId)}
				onOpenChange={(open) => {
					if (!open) setActiveColumnId(null);
				}}
				columnId={activeColumnId}
				boardId={boardId ?? ""}
			/>
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
