import { createColumnHelper } from "@tanstack/react-table";
import { isEmpty } from "es-toolkit/compat";
import { Calendar, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "@/feature/task/components/priority-badge";
import type { BoardTableFeatures } from "./table-features";
import type { TableTaskRow } from "./types";

const helper = createColumnHelper<BoardTableFeatures, TableTaskRow>();

export const tableColumns = helper.columns([
	helper.accessor("title", {
		header: "Task Title",
		cell: ({ row }) => {
			const task = row.original;
			return (
				<div className="flex items-center gap-2.5 py-1">
					<PriorityBadge priority={task.priority} variant="dot" />
					<div className="flex flex-col min-w-0">
						<span className="text-sm font-medium text-foreground truncate">
							{task.title}
						</span>
						{task.description && (
							<span className="text-xs text-muted-foreground truncate max-w-md">
								{task.description}
							</span>
						)}
					</div>
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
							<AvatarImage src={assignee.avatarUrl ?? ""} alt={assignee.name} />
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
		cell: ({ row, table }) => {
			if (row.original.isEmptyPlaceholder) return null;

			const onTaskClick = (
				table.options.meta as { onTaskClick?: (id: string) => void } | undefined
			)?.onTaskClick;

			return (
				<div className="flex justify-end">
					<Button
						variant="ghost"
						size="icon"
						className="size-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground cursor-pointer"
						onClick={(e) => {
							e.stopPropagation();
							onTaskClick?.(row.original.id);
						}}
						aria-label="Task options"
					>
						<MoreHorizontal className="size-3.5" />
					</Button>
				</div>
			);
		},
	}),
]);
