import {
	type Bolt,
	type ColumnWithTasksSchema,
	type Priority,
	PrioritySchema,
	type TaskWithAssigneesSchema,
	type Unit,
	type UpdateTaskSchema,
} from "@scrum-board/shared/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";
import {
	Calendar,
	ChevronDown,
	ChevronRight,
	Clock,
	Columns3,
	Flag,
	GitBranch,
	Layers,
	Plus,
	Users,
	Zap,
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
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useGetBoardGitHubQuery } from "@/feature/board/api/use-get-board-github";
import { useCreateTaskBranchMutation } from "@/feature/task/api/use-create-task-branch";
import { PriorityBadge } from "@/feature/task/components/priority-badge";
import { useGetUsersQuery } from "@/feature/user/api/use-get-users";
import {
	buildSuggestedBranchName,
	formatTaskDateTime,
	fromOptionalSelectValue,
	SELECT_UNSET_VALUE,
	toOptionalSelectValue,
} from "./task-detail.utils";
import { PROPERTY_ROW_ALIGN, TaskPropertyRow } from "./task-property-row";

type TaskWithAssignees = z.infer<typeof TaskWithAssigneesSchema>;
type ColumnWithTasks = z.infer<typeof ColumnWithTasksSchema>;
type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

type TaskPropertiesSectionProps = {
	task: TaskWithAssignees;
	columns?: ColumnWithTasks[];
	units?: Unit[];
	bolts?: Bolt[];
	boardId?: string;
	columnName?: string;
	onUpdateTask?: (data: UpdateTaskInput) => void;
};

export const TaskPropertiesSection = ({
	task,
	columns = [],
	units = [],
	bolts = [],
	boardId,
	columnName,
	onUpdateTask,
}: TaskPropertiesSectionProps) => {
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState(true);
	const { data: users } = useGetUsersQuery();
	const { data: githubInfo } = useGetBoardGitHubQuery(boardId);
	const { mutate: createOrLinkBranch, isPending: isCreatingBranch } =
		useCreateTaskBranchMutation();

	const assigneeIds = task.assignees.map((a) => a.id);
	const branches = githubInfo?.branches ?? [];

	const handleToggleAssignee = (userId: string, checked: boolean) => {
		const nextAssigneeIds = checked
			? [...assigneeIds, userId]
			: assigneeIds.filter((id) => id !== userId);
		onUpdateTask?.({ assigneeIds: nextAssigneeIds });
	};

	const handleCreateGitHubBranch = () => {
		const suggestedBranch = buildSuggestedBranchName(task.title);
		createOrLinkBranch(
			{
				id: task.id,
				data: {
					branchName: suggestedBranch,
					createOnGitHub: true,
				},
			},
			{
				onSuccess: () => {
					if (boardId) {
						queryClient.invalidateQueries({ queryKey: ["board", boardId] });
						queryClient.invalidateQueries({
							queryKey: ["board-github", boardId],
						});
					}
				},
			},
		);
	};

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
				<TaskPropertyRow icon={Columns3} label="Gate / Status">
					{!isEmpty(columns) && onUpdateTask ? (
						<Select
							value={task.columnId}
							onValueChange={(nextColId) =>
								onUpdateTask({ columnId: nextColId })
							}
						>
							<SelectTrigger
								size="sm"
								className="h-7 w-fit gap-1.5 border-border/60 bg-background px-2.5 text-xs cursor-pointer"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{columns.map((col) => (
									<SelectItem
										key={col.id}
										value={col.id}
										className="text-xs cursor-pointer"
									>
										{col.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					) : (
						<Badge variant="outline" className="bg-background font-normal">
							{columnName ?? "Unknown"}
						</Badge>
					)}
				</TaskPropertyRow>

				<TaskPropertyRow icon={Flag} label="Priority">
					{onUpdateTask ? (
						<Select
							value={task.priority}
							onValueChange={(nextPriority: Priority) =>
								onUpdateTask({ priority: nextPriority })
							}
						>
							<SelectTrigger
								size="sm"
								className="h-7 w-fit gap-1.5 border-none bg-transparent p-0 shadow-none hover:bg-accent/50 cursor-pointer"
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{PrioritySchema.options.map((priority) => (
									<SelectItem
										key={priority}
										value={priority}
										className="cursor-pointer"
									>
										<PriorityBadge priority={priority} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					) : (
						<PriorityBadge priority={task.priority} />
					)}
				</TaskPropertyRow>

				<TaskPropertyRow icon={Layers} label="Unit of Work">
					{onUpdateTask && !isEmpty(units) ? (
						<Select
							value={toOptionalSelectValue(task.unitId)}
							onValueChange={(val) =>
								onUpdateTask({ unitId: fromOptionalSelectValue(val) })
							}
						>
							<SelectTrigger
								size="sm"
								className="h-7 w-fit gap-1.5 border-border/60 bg-background px-2.5 text-xs cursor-pointer"
							>
								<SelectValue placeholder="No Unit" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									value={SELECT_UNSET_VALUE}
									className="text-xs text-muted-foreground cursor-pointer"
								>
									No Unit
								</SelectItem>
								{units.map((unit) => (
									<SelectItem
										key={unit.id}
										value={unit.id}
										className="text-xs cursor-pointer"
									>
										<span className="inline-flex items-center gap-1.5">
											<span
												className="size-2 rounded-full"
												style={{ backgroundColor: unit.color }}
											/>
											{unit.name}
										</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					) : (
						<span className="text-muted-foreground">
							{task.unit?.name ?? "None"}
						</span>
					)}
				</TaskPropertyRow>

				<TaskPropertyRow icon={Zap} label="Bolt">
					{onUpdateTask && !isEmpty(bolts) ? (
						<Select
							value={toOptionalSelectValue(task.boltId)}
							onValueChange={(val) =>
								onUpdateTask({ boltId: fromOptionalSelectValue(val) })
							}
						>
							<SelectTrigger
								size="sm"
								className="h-7 w-fit gap-1.5 border-border/60 bg-background px-2.5 text-xs cursor-pointer"
							>
								<SelectValue placeholder="No Bolt" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									value={SELECT_UNSET_VALUE}
									className="text-xs text-muted-foreground cursor-pointer"
								>
									Backlog (No Bolt)
								</SelectItem>
								{bolts.map((bolt) => (
									<SelectItem
										key={bolt.id}
										value={bolt.id}
										className="text-xs cursor-pointer"
									>
										{bolt.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					) : (
						<span className="text-muted-foreground">
							{task.bolt?.name ?? "Backlog"}
						</span>
					)}
				</TaskPropertyRow>

				<TaskPropertyRow
					icon={GitBranch}
					label="Git Branch"
					align={PROPERTY_ROW_ALIGN.START}
				>
					<div className="flex flex-wrap items-center gap-1.5">
						{onUpdateTask && !isEmpty(branches) ? (
							<Select
								value={toOptionalSelectValue(task.branchName)}
								onValueChange={(val) =>
									onUpdateTask({
										branchName: fromOptionalSelectValue(val),
									})
								}
							>
								<SelectTrigger
									size="sm"
									className="h-7 w-fit gap-1.5 border-border/60 bg-background px-2.5 font-mono text-[11px] cursor-pointer"
								>
									<SelectValue placeholder="Unlinked" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										value={SELECT_UNSET_VALUE}
										className="text-xs text-muted-foreground cursor-pointer"
									>
										Unlinked
									</SelectItem>
									{task.branchName &&
										!branches.some((b) => b.name === task.branchName) && (
											<SelectItem
												value={task.branchName}
												className="font-mono text-xs cursor-pointer"
											>
												{task.branchName}
											</SelectItem>
										)}
									{branches.map((branch) => (
										<SelectItem
											key={branch.name}
											value={branch.name}
											className="font-mono text-xs cursor-pointer"
										>
											{branch.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : task.branchName ? (
							<Badge variant="secondary" className="font-mono text-[11px]">
								{task.branchName}
							</Badge>
						) : null}

						{!task.branchName && (
							<Button
								type="button"
								variant="outline"
								size="xs"
								disabled={isCreatingBranch}
								onClick={handleCreateGitHubBranch}
								className="h-7 gap-1 border-dashed text-[11px] cursor-pointer"
							>
								{isCreatingBranch ? (
									<Spinner className="size-3" />
								) : (
									<Plus className="size-3" />
								)}
								Create branch on GitHub
							</Button>
						)}
					</div>
				</TaskPropertyRow>

				<TaskPropertyRow
					icon={Users}
					label="Assignees"
					align={PROPERTY_ROW_ALIGN.START}
				>
					<div className="flex flex-wrap items-center gap-1.5">
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

						{onUpdateTask && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										type="button"
										variant="outline"
										size="xs"
										className="h-6 rounded-full border-dashed px-2 text-[11px] text-muted-foreground cursor-pointer"
									>
										<Plus className="size-3" />
										{isEmpty(task.assignees) ? "Assign" : "Edit"}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-48">
									<DropdownMenuLabel className="text-xs">
										Team members
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{users?.map((user) => {
										const isSelected = assigneeIds.includes(user.id);
										return (
											<DropdownMenuCheckboxItem
												key={user.id}
												checked={isSelected}
												onSelect={(e) => e.preventDefault()}
												onCheckedChange={(checked) =>
													handleToggleAssignee(user.id, Boolean(checked))
												}
												className="gap-2 cursor-pointer"
											>
												<Avatar className="size-4">
													<AvatarImage src={user.avatarUrl ?? ""} />
													<AvatarFallback className="text-[8px]">
														{user.name.charAt(0).toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<span className="text-xs">{user.name}</span>
											</DropdownMenuCheckboxItem>
										);
									})}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
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
