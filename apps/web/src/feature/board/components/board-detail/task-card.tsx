import type { TaskWithAssigneesSchema } from "@scrum-board/shared/schemas";
import type { VariantProps } from "class-variance-authority";
import { isEmpty } from "es-toolkit/compat";
import { Calendar } from "lucide-react";
import type React from "react";
import type { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, type cardVariants } from "@/components/ui/card";
import {
	PRIORITY_BADGE_VARIANT,
	PriorityBadge,
} from "@/feature/task/components/priority-badge";
import { getTaskDescriptionPreview } from "@/feature/task/components/task-detail-sheet";

type Task = z.infer<typeof TaskWithAssigneesSchema>;

type TaskCardProps = {
	task: Task;
	onClick?: () => void;
	variant?: VariantProps<typeof cardVariants>["variant"];
	ref?: React.Ref<HTMLDivElement>;
};

export const TaskCard = ({ task, onClick, variant, ref }: TaskCardProps) => {
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
			<div className="flex items-center gap-2">
				<PriorityBadge
					priority={task.priority}
					variant={PRIORITY_BADGE_VARIANT.DOT}
				/>
				<span className="text-sm font-medium leading-tight text-foreground truncate">
					{task.title}
				</span>
			</div>

			{descriptionPreview && (
				<p className="text-xs text-muted-foreground line-clamp-2">
					{descriptionPreview}
				</p>
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
