import type { ColumnWithTasksSchema } from "@scrum-board/shared/schemas";
import { MoreHorizontal, Plus } from "lucide-react";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskCard } from "./task-card";

type ColumnWithTasks = z.infer<typeof ColumnWithTasksSchema>;

type KanbanColumnProps = {
	column: ColumnWithTasks;
	onAddTask?: (columnId: string) => void;
	onTaskClick?: (taskId: string) => void;
	onEditColumn?: (column: ColumnWithTasks) => void;
	onDeleteColumn?: (columnId: string) => void;
};

export const KanbanColumn = ({
	column,
	onAddTask,
	onTaskClick,
	onEditColumn,
	onDeleteColumn,
}: KanbanColumnProps) => {
	return (
		<div className="flex h-full w-80 shrink-0 flex-col rounded-2xl border border-border/40 bg-secondary/20 p-3">
			<div className="group/header flex shrink-0 items-center justify-between pb-3">
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold tracking-tight text-foreground">
						{column.name}
					</span>
					<span className="inline-flex size-5 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
						{column.tasks.length}
					</span>
				</div>

				<div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/header:opacity-100">
					<Button
						variant="ghost"
						size="icon"
						className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
						onClick={() => onAddTask?.(column.id)}
					>
						<Plus className="size-4" />
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
							>
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => onEditColumn?.(column)}>
								Edit column
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-destructive focus:text-destructive"
								onClick={() => onDeleteColumn?.(column.id)}
							>
								Delete column
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="flex flex-1 flex-col gap-2.5 overflow-y-auto min-h-0 pr-1 custom-scrollbar">
				{column.tasks.map((task) => (
					<TaskCard
						key={task.id}
						task={task}
						onClick={() => onTaskClick?.(task.id)}
					/>
				))}

				<Button
					variant="outline"
					className="w-full shrink-0 rounded-xl border-dashed py-3 text-xs text-muted-foreground cursor-pointer"
					onClick={() => onAddTask?.(column.id)}
				>
					<Plus />
					Add card
				</Button>
			</div>
		</div>
	);
};
