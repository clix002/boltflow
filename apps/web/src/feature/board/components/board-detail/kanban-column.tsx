import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";
import type {
	ColumnWithTasksSchema,
	TaskWithAssigneesSchema,
} from "@scrum-board/shared/schemas";
import { cva } from "class-variance-authority";
import { MoreHorizontal, Plus } from "lucide-react";
import type { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SortableTaskCard } from "./sortable-task-card";
import { DND_TYPE } from "./types";

type ColumnWithTasks = z.infer<typeof ColumnWithTasksSchema>;
type TaskWithAssignees = z.infer<typeof TaskWithAssigneesSchema>;

const kanbanColumnVariants = cva(
	"flex h-full w-80 shrink-0 flex-col rounded-2xl border border-border/70 bg-muted/50 dark:bg-zinc-900/75 p-3 shadow-xs transition-colors",
	{
		variants: {
			isDropTarget: {
				true: "bg-secondary/60 dark:bg-zinc-900 border-primary/50 ring-2 ring-primary/20",
				false: "",
			},
		},
		defaultVariants: {
			isDropTarget: false,
		},
	},
);

type KanbanColumnProps = {
	column: ColumnWithTasks;
	onAddTask?: (columnId: string) => void;
	onTaskClick?: (taskId: string) => void;
	onEditTask?: (task: TaskWithAssignees) => void;
	onDeleteTask?: (taskId: string) => void;
	onEditColumn?: (column: ColumnWithTasks) => void;
	onDeleteColumn?: (columnId: string) => void;
};

export const KanbanColumn = ({
	column,
	onAddTask,
	onTaskClick,
	onEditTask,
	onDeleteTask,
	onEditColumn,
	onDeleteColumn,
}: KanbanColumnProps) => {
	const { ref, isDropTarget } = useDroppable({
		id: column.id,
		type: DND_TYPE.COLUMN,
		accept: DND_TYPE.TASK,
		collisionPriority: CollisionPriority.Low,
	});

	return (
		<div ref={ref} className={cn(kanbanColumnVariants({ isDropTarget }))}>
			<div className="group/header flex shrink-0 items-center justify-between pb-3">
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold tracking-tight text-foreground">
						{column.name}
					</span>
					<Badge
						variant="secondary"
						className="size-5 justify-center p-0 text-[11px]"
					>
						{column.tasks.length}
					</Badge>
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

			<div className="flex flex-1 flex-col gap-2.5 overflow-y-auto min-h-0 p-0.5 pr-1 custom-scrollbar">
				{column.tasks.map((task, index) => (
					<SortableTaskCard
						key={task.id}
						task={task}
						index={index}
						onClick={() => onTaskClick?.(task.id)}
						onEdit={() => onEditTask?.(task)}
						onDelete={() => onDeleteTask?.(task.id)}
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
