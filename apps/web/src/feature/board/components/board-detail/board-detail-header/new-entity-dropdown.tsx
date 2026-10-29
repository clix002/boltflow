import { Plus } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetBoardQuery } from "@/feature/board/api/use-get-board";
import { resolveActiveUnit } from "@/feature/board/components/board-detail/dnd.utils";
import { useBoardPreferences } from "@/feature/board/components/board-detail/use-board-preferences";
import { CreateColumnDialog } from "@/feature/column/components/form/create-column-dialog";
import { CreateTaskDialog } from "@/feature/task/components/form/create-task-dialog";

export const NewEntityDropdown = () => {
	const { boardId } = useParams<{ boardId: string }>();
	const { selectedUnitId } = useBoardPreferences();
	const { data: board } = useGetBoardQuery(boardId);
	const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
	const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);

	if (!boardId) return null;

	const activeUnit = resolveActiveUnit(board?.units, selectedUnitId);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						size="sm"
						className="h-8 gap-1 rounded-full px-3 text-xs cursor-pointer"
					>
						<Plus className="size-3.5" />
						New
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={() => setIsCreateTaskOpen(true)}
						disabled={!activeUnit}
						className="cursor-pointer"
					>
						New Task
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setIsCreateColumnOpen(true)}
						disabled={!activeUnit}
						className="cursor-pointer"
					>
						New Column
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{isCreateTaskOpen && (
				<CreateTaskDialog
					key="new-task"
					open={isCreateTaskOpen}
					onOpenChange={setIsCreateTaskOpen}
					boardId={boardId}
				/>
			)}

			{isCreateColumnOpen && activeUnit && (
				<CreateColumnDialog
					open={isCreateColumnOpen}
					onOpenChange={setIsCreateColumnOpen}
					boardId={boardId}
					unitId={activeUnit.id}
				/>
			)}
		</>
	);
};
