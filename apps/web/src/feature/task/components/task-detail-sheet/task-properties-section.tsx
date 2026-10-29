import type { TaskWithAssigneesSchema } from "@scrum-board/shared/schemas";
import { isEmpty } from "es-toolkit/compat";
import {
	Calendar,
	ChevronDown,
	ChevronRight,
	Clock,
	Columns3,
	Flag,
	Users,
} from "lucide-react";
import { useState } from "react";
import type { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PriorityBadge } from "@/feature/task/components/priority-badge";
import { formatTaskDateTime } from "./task-detail.utils";
import { PROPERTY_ROW_ALIGN, TaskPropertyRow } from "./task-property-row";

type TaskWithAssignees = z.infer<typeof TaskWithAssigneesSchema>;

type TaskPropertiesSectionProps = {
	task: TaskWithAssignees;
	columnName?: string;
};

export const TaskPropertiesSection = ({
	task,
	columnName,
}: TaskPropertiesSectionProps) => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="rounded-xl border border-border/50 bg-muted/20 p-3.5"
		>
			<CollapsibleTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="xs"
					className="flex h-auto w-full items-center justify-between p-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-transparent hover:text-foreground cursor-pointer"
				>
					<span>Properties</span>
					{isOpen ? (
						<ChevronDown className="size-4" />
					) : (
						<ChevronRight className="size-4" />
					)}
				</Button>
			</CollapsibleTrigger>

			<CollapsibleContent className="mt-3.5 flex flex-col gap-3 text-xs">
				<TaskPropertyRow icon={Columns3} label="Status">
					<Badge variant="outline" className="bg-background font-normal">
						{columnName ?? "Unknown"}
					</Badge>
				</TaskPropertyRow>

				<TaskPropertyRow icon={Flag} label="Priority">
					<PriorityBadge priority={task.priority} />
				</TaskPropertyRow>

				<TaskPropertyRow
					icon={Users}
					label="Assignees"
					align={PROPERTY_ROW_ALIGN.START}
				>
					{isEmpty(task.assignees) ? (
						<span className="italic text-muted-foreground/60">Unassigned</span>
					) : (
						<div className="flex flex-wrap gap-1.5">
							{task.assignees.map((assignee) => (
								<div
									key={assignee.id}
									className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-2 py-0.5"
								>
									<Avatar className="size-4">
										<AvatarImage
											src={assignee.avatarUrl ?? ""}
											alt={assignee.name}
										/>
										<AvatarFallback className="text-[8px] font-semibold">
											{assignee.name.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<span className="text-xs font-medium text-foreground">
										{assignee.name}
									</span>
								</div>
							))}
						</div>
					)}
				</TaskPropertyRow>

				<TaskPropertyRow icon={Calendar} label="Created">
					<span className="text-foreground/80">
						{formatTaskDateTime(task.createdAt)}
					</span>
				</TaskPropertyRow>

				<TaskPropertyRow icon={Clock} label="Updated">
					<span className="text-foreground/80">
						{formatTaskDateTime(task.updatedAt)}
					</span>
				</TaskPropertyRow>
			</CollapsibleContent>
		</Collapsible>
	);
};
