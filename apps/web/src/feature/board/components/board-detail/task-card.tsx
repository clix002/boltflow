import type { TaskWithAssigneesSchema } from "@scrum-board/shared/schemas";
import { isEmpty } from "es-toolkit/compat";
import { Calendar } from "lucide-react";
import type { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/feature/task/components/priority-badge";

type Task = z.infer<typeof TaskWithAssigneesSchema>;

type TaskCardProps = {
	task: Task;
	onClick?: () => void;
};

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
	const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});

	return (
		<Card
			size="sm"
			onClick={onClick}
			className="shrink-0 gap-2.5 p-3.5 shadow-sm transition-all hover:bg-accent/40 hover:shadow-md cursor-pointer"
		>
			<div className="flex items-center gap-2">
				<PriorityBadge priority={task.priority} variant="dot" />
				<span className="text-sm font-medium leading-tight text-foreground truncate">
					{task.title}
				</span>
			</div>

			{task.description && (
				<p className="text-xs text-muted-foreground line-clamp-2">
					{task.description}
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
