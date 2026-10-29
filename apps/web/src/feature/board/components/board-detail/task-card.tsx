import type { TaskWithAssigneesSchema } from "@scrum-board/shared/schemas";
import type { VariantProps } from "class-variance-authority";
import { isEmpty } from "es-toolkit/compat";
import { Calendar, GitBranch, Zap } from "lucide-react";
import type React from "react";
import type { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, type cardVariants } from "@/components/ui/card";
import {
	PRIORITY_BADGE_VARIANT,
	PriorityBadge,
} from "@/feature/task/components/priority-badge";
import { TaskActionsMenu } from "@/feature/task/components/task-actions-menu";
import { getTaskDescriptionPreview } from "@/feature/task/components/task-detail-sheet";

type Task = z.infer<typeof TaskWithAssigneesSchema>;

type TaskCardProps = {
	task: Task;
	onClick?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
	variant?: VariantProps<typeof cardVariants>["variant"];
	ref?: React.Ref<HTMLDivElement>;
};

export const TaskCard = ({
	task,
	onClick,
	onEdit,
	onDelete,
	variant,
	ref,
}: TaskCardProps) => {
	const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
	const descriptionPreview = getTaskDescriptionPreview(task.description);

	return (
		<Card
			ref={ref}
			size="sm"
			variant={variant}
			onClick={onClick}
			className="shrink-0 gap-2.5 p-3.5 shadow-sm"
		>
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2 min-w-0">
					<PriorityBadge
						priority={task.priority}
						variant={PRIORITY_BADGE_VARIANT.DOT}
					/>
					<span className="text-sm font-medium leading-tight text-foreground truncate">
						{task.title}
					</span>
				</div>

				{onEdit && onDelete && (
					<TaskActionsMenu onEdit={onEdit} onDelete={onDelete} />
				)}
			</div>

			{descriptionPreview && (
				<p className="text-xs text-muted-foreground line-clamp-2">
					{descriptionPreview}
				</p>
			)}

			{(task.bolt || task.branchName) && (
				<div className="flex flex-wrap items-center gap-1.5 pt-0.5">
					{task.bolt && (
						<Badge
							variant="outline"
							className="h-5 gap-1 px-1.5 text-[10px] font-medium bg-background/60"
						>
							<Zap className="size-2.5 text-amber-500 shrink-0" />
							<span className="truncate max-w-28">{task.bolt.name}</span>
						</Badge>
					)}

					{task.branchName && (
						<Badge
							variant="secondary"
							className="h-5 gap-1 px-1.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400"
						>
							<GitBranch className="size-2.5 shrink-0" />
							<span className="truncate max-w-32">{task.branchName}</span>
						</Badge>
					)}
				</div>
			)}

			<div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
				<div className="flex items-center gap-1.5 text-[11px]">
					<Calendar className="size-3 text-muted-foreground/70" />
					<span>{formattedDate}</span>
				</div>

				{!isEmpty(task.assignees) && (
					<div className="flex -space-x-1.5 overflow-hidden">
						{task.assignees.map((assignee) => (
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
				)}
			</div>
		</Card>
	);
};
