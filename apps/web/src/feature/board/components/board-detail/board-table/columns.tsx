import { createColumnHelper } from "@tanstack/react-table";
import { isEmpty } from "es-toolkit/compat";
import { Calendar, GripVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	PRIORITY_BADGE_VARIANT,
	PriorityBadge,
} from "@/feature/task/components/priority-badge";
import { TaskActionsMenu } from "@/feature/task/components/task-actions-menu";
import type { BoardTableFeatures } from "./table-features";
import type { TableColumnsProps, TableTaskRow } from "./types";

const helper = createColumnHelper<BoardTableFeatures, TableTaskRow>();

export const createTableColumns = ({
	onEditTask,
	onDeleteTask,
}: TableColumnsProps = {}) =>
	helper.columns([
		helper.accessor("title", {
			header: "Task Title",
			cell: ({ row }) => {
				const task = row.original;
				return (
					<div className="flex items-center gap-2.5 py-1 min-w-0">
						<GripVertical className="size-3.5 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
						<PriorityBadge
							priority={task.priority}
							variant={PRIORITY_BADGE_VARIANT.DOT}
						/>
						<span className="text-sm font-medium text-foreground truncate">
							{task.title}
						</span>
					</div>
				);
			},
		}),
		helper.accessor("columnName", {
			header: "Column",
			cell: ({ row }) => (
				<Badge variant="secondary" className="text-[11px] font-normal">
					{row.original.columnName}
				</Badge>
			),
		}),
		helper.accessor("priority", {
			header: "Priority",
			cell: ({ row }) => {
				if (row.original.isEmptyPlaceholder) return null;
				return <PriorityBadge priority={row.original.priority} />;
			},
		}),
		helper.accessor("assignees", {
			header: "Assignees",
			cell: ({ row }) => {
				const assignees = row.original.assignees;
				if (isEmpty(assignees)) {
					return (
						<span className="text-xs text-muted-foreground/60 italic">
							Unassigned
						</span>
					);
				}

				return (
					<div className="flex -space-x-1.5 overflow-hidden">
						{assignees.map((assignee) => (
							<Avatar
								key={assignee.id}
								className="size-5 border border-background"
							>
								<AvatarImage
									src={assignee.avatarUrl ?? ""}
									alt={assignee.name}
								/>
								<AvatarFallback className="text-[9px] font-semibold">
									{assignee.name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
						))}
					</div>
				);
			},
		}),
		helper.accessor("createdAt", {
			header: "Date",
			cell: ({ row }) => {
				const createdAt = row.original.createdAt;
				if (!createdAt) return null;
				const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				});

				return (
					<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<Calendar className="size-3 text-muted-foreground/70" />
						<span>{formattedDate}</span>
					</div>
				);
			},
		}),
		helper.display({
			id: "actions",
			header: "",
			cell: ({ row }) => {
				const task = row.original;
				if (task.isEmptyPlaceholder || !onEditTask || !onDeleteTask) {
					return null;
				}

				return (
					<div className="flex justify-end">
						<TaskActionsMenu
							onEdit={() => onEditTask(task)}
							onDelete={() => onDeleteTask(task.id)}
						/>
					</div>
				);
			},
		}),
	]);
