import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TaskActionsMenuProps = {
	onEdit: () => void;
	onDelete: () => void;
};

export const TaskActionsMenu = ({ onEdit, onDelete }: TaskActionsMenuProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="size-6 shrink-0 opacity-0 transition-opacity group-hover/card:opacity-100 group-hover:opacity-100 text-muted-foreground hover:text-foreground cursor-pointer"
					onClick={(e) => e.stopPropagation()}
					onPointerDown={(e) => e.stopPropagation()}
					aria-label="Task actions"
				>
					<MoreHorizontal className="size-3.5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
				<DropdownMenuItem className="cursor-pointer" onSelect={() => onEdit()}>
					<Pencil className="size-3.5" />
					Edit task
				</DropdownMenuItem>
				<DropdownMenuItem
					className="text-destructive focus:text-destructive cursor-pointer"
					onSelect={() => onDelete()}
				>
					<Trash2 className="size-3.5" />
					Delete task
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
