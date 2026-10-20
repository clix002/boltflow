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
import { CreateColumnDialog } from "@/feature/column/components/form/create-column-dialog";
import { CreateTaskDialog } from "@/feature/task/components/form/create-task-dialog";

export const NewEntityDropdown = () => {
	const { boardId } = useParams<{ boardId: string }>();
	const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
	const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);

	if (!boardId) return null;

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
						className="cursor-pointer"
					>
						New Task
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setIsCreateColumnOpen(true)}
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

			{isCreateColumnOpen && (
				<CreateColumnDialog
					open={isCreateColumnOpen}
					onOpenChange={setIsCreateColumnOpen}
					boardId={boardId}
				/>
			)}
		</>
	);
};
