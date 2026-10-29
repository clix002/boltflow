import type {
	ColumnWithTasksSchema,
	TaskWithAssigneesSchema,
	UpdateTaskSchema,
} from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { useQueryClient } from "@tanstack/react-query";
import { debounce } from "es-toolkit";
import { useMemo, useState } from "react";
import type { z } from "zod";
import { INPUT_VARIANT, Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	SHEET_SIDE,
	SHEET_SIZE,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	type SheetSize,
	SheetTitle,
} from "@/components/ui/sheet";
import { useSidebar } from "@/components/ui/sidebar";
import {
	type UpdateTaskVariables,
	useUpdateTaskMutation,
} from "@/feature/task/api/use-update-task";
import { cn } from "@/lib/utils";
import { TaskDescriptionSection } from "./task-description-section";
import { TaskPropertiesSection } from "./task-properties-section";
import { TaskSheetToolbar } from "./task-sheet-toolbar";

type TaskWithAssignees = z.infer<typeof TaskWithAssigneesSchema>;
type ColumnWithTasks = z.infer<typeof ColumnWithTasksSchema>;
type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

type TaskDetailSheetProps = {
	task: Maybe<TaskWithAssignees>;
	columns?: ColumnWithTasks[];
	boardId?: string;
	columnName?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDeleteTask?: (taskId: string) => void;
};

export const TaskDetailSheet = ({
	task,
	columns,
	boardId,
	columnName,
	open,
	onOpenChange,
	onDeleteTask,
}: TaskDetailSheetProps) => {
	const queryClient = useQueryClient();
	const { open: isSidebarOpen } = useSidebar();
	const {
		mutate: updateTask,
		isPending: isSaving,
		isSuccess: hasSavedRecently,
		reset: resetSaveState,
	} = useUpdateTaskMutation();

	const [size, setSize] = useState<SheetSize>(SHEET_SIZE.DEFAULT);

	const isExpanded = size === SHEET_SIZE.EXPANDED;

	const persistUpdate = (payload: UpdateTaskVariables) => {
		updateTask(payload, {
			onSuccess: () => {
				if (boardId) {
					queryClient.invalidateQueries({ queryKey: ["board", boardId] });
				}
			},
		});
	};

	const debouncedSave = useMemo(
		() =>
			debounce((payload: UpdateTaskVariables) => {
				updateTask(payload, {
					onSuccess: () => {
						if (boardId) {
							queryClient.invalidateQueries({ queryKey: ["board", boardId] });
						}
					},
				});
			}, 650),
		[boardId, queryClient, updateTask],
	);

	const toggleSize = () => {
		setSize((prev) =>
			prev === SHEET_SIZE.EXPANDED ? SHEET_SIZE.DEFAULT : SHEET_SIZE.EXPANDED,
		);
	};

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			debouncedSave.flush();
			setSize(SHEET_SIZE.DEFAULT);
			resetSaveState();
		}
		onOpenChange(nextOpen);
	};

	const queueTaskUpdate = (data: UpdateTaskInput) => {
		if (!task) return;
		debouncedSave({ id: task.id, data });
	};

	const handleImmediateUpdate = (data: UpdateTaskInput) => {
		if (!task) return;
		persistUpdate({ id: task.id, data });
	};

	const handleTitleChange = (nextTitle: string) => {
		const trimmed = nextTitle.trim();
		if (!task || !trimmed || trimmed === task.title) return;
		queueTaskUpdate({ title: trimmed });
	};

	const handleDescriptionChange = (serializedDescription: Maybe<string>) => {
		queueTaskUpdate({ description: serializedDescription });
	};

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent
				side={SHEET_SIDE.RIGHT}
				size={size}
				insetSidebar={isSidebarOpen}
				className="gap-0 p-0"
			>
				{task && (
					<>
						<TaskSheetToolbar
							columnName={columnName}
							isExpanded={isExpanded}
							isSaving={isSaving}
							hasSavedRecently={hasSavedRecently}
							onToggleSize={toggleSize}
							onDeleteTask={
								onDeleteTask ? () => onDeleteTask(task.id) : undefined
							}
						/>

						<div className="flex-1 overflow-y-auto px-14 py-6 custom-scrollbar">
							<div
								className={cn(
									"flex min-h-full w-full flex-col transition-all duration-300",
									isExpanded && "mx-auto max-w-4xl py-4",
								)}
							>
								<SheetHeader className="p-0 pb-6">
									<SheetTitle className="sr-only">{task.title}</SheetTitle>
									<Input
										key={task.id}
										type="text"
										variant={INPUT_VARIANT.GHOST}
										defaultValue={task.title}
										onChange={(e) => handleTitleChange(e.target.value)}
										placeholder="Untitled task"
										className="h-auto text-xl md:text-2xl font-semibold tracking-tight text-foreground leading-snug placeholder:text-muted-foreground/50 md:text-2xl"
									/>
									<SheetDescription className="sr-only">
										Task details and properties for {task.title}
									</SheetDescription>
								</SheetHeader>

								<TaskPropertiesSection
									task={task}
									columns={columns}
									columnName={columnName}
									onUpdateTask={handleImmediateUpdate}
								/>

								<Separator className="my-6" />

								<TaskDescriptionSection
									taskId={task.id}
									description={task.description}
									onDescriptionChange={handleDescriptionChange}
								/>
							</div>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
};
