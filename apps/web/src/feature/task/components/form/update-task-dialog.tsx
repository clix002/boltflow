import { zodResolver } from "@hookform/resolvers/zod";
import {
	PrioritySchema,
	type TaskWithAssigneesSchema,
	UpdateTaskSchema,
} from "@scrum-board/shared/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";
import { ChevronsUpDown } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useGetBoardQuery } from "@/feature/board/api/use-get-board";
import { useUpdateTaskMutation } from "@/feature/task/api/use-update-task";
import { useGetUsersQuery } from "@/feature/user/api/use-get-users";
import { PriorityBadge } from "../priority-badge";

type TaskWithAssignees = z.infer<typeof TaskWithAssigneesSchema>;

type UpdateTaskDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	task: TaskWithAssignees;
	boardId: string;
};

const FormSchema = UpdateTaskSchema.pick({
	title: true,
	columnId: true,
	priority: true,
	assigneeIds: true,
});

type FormInput = z.input<typeof FormSchema>;
type FormOutput = z.output<typeof FormSchema>;

export const UpdateTaskDialog = ({
	open,
	onOpenChange,
	task,
	boardId,
}: UpdateTaskDialogProps) => {
	const queryClient = useQueryClient();
	const { mutate: updateTask, isPending } = useUpdateTaskMutation();
	const { data: users, isPending: isLoadingUsers } = useGetUsersQuery();
	const { data: board } = useGetBoardQuery(boardId);
	const columns = board?.columns ?? [];

	const form = useForm<FormInput, unknown, FormOutput>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: task.title,
			columnId: task.columnId,
			priority: task.priority,
			assigneeIds: task.assignees.map((a) => a.id),
		},
	});

	const onSubmit = (data: FormOutput) => {
		updateTask(
			{
				id: task.id,
				data,
			},
			{
				onSuccess: () => {
					toast.success("Task updated successfully");
					queryClient.invalidateQueries({ queryKey: ["board", boardId] });
					onOpenChange(false);
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Task</DialogTitle>
					<DialogDescription>
						Update the details and properties of this task.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mt-4 flex flex-col gap-4"
				>
					<Controller
						name="title"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Title</FieldLabel>
								<Input
									{...field}
									value={field.value ?? ""}
									id={field.name}
									placeholder="e.g. Implement drag and drop"
									aria-invalid={fieldState.invalid}
									autoFocus
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					{!isEmpty(columns) && (
						<Controller
							name="columnId"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Column</FieldLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger
											id={field.name}
											className="w-full cursor-pointer"
										>
											<SelectValue placeholder="Select a column" />
										</SelectTrigger>
										<SelectContent>
											{columns.map((col) => (
												<SelectItem
													key={col.id}
													value={col.id}
													className="cursor-pointer"
												>
													{col.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					)}

					<Controller
						name="priority"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Priority</FieldLabel>
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger
										id={field.name}
										className="w-full cursor-pointer"
									>
										<SelectValue placeholder="Select priority" />
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
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						name="assigneeIds"
						control={form.control}
						render={({ field }) => {
							const selectedUsers =
								users?.filter((u) => field.value?.includes(u.id)) ?? [];

							return (
								<Field>
									<FieldLabel>Assignees</FieldLabel>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												type="button"
												variant="outline"
												disabled={isLoadingUsers}
												className="w-full justify-between font-normal cursor-pointer"
											>
												{!isEmpty(selectedUsers) ? (
													<div className="flex items-center gap-2">
														<div className="flex -space-x-1.5 overflow-hidden">
															{selectedUsers.map((u) => (
																<Avatar
																	key={u.id}
																	className="size-5 border border-background"
																>
																	<AvatarImage src={u.avatarUrl ?? ""} />
																	<AvatarFallback className="text-[9px]">
																		{u.name.charAt(0).toUpperCase()}
																	</AvatarFallback>
																</Avatar>
															))}
														</div>
														<span className="text-xs text-muted-foreground">
															{selectedUsers.length} selected
														</span>
													</div>
												) : (
													<span className="text-muted-foreground">
														{isLoadingUsers ? (
															<Spinner />
														) : (
															"Select assignees..."
														)}
													</span>
												)}
												<ChevronsUpDown className="size-4 shrink-0 opacity-50" />
											</Button>
										</DropdownMenuTrigger>

										<DropdownMenuContent
											className="w-[--radix-dropdown-menu-trigger-width] p-1"
											align="start"
										>
											<DropdownMenuLabel>Team members</DropdownMenuLabel>
											<DropdownMenuSeparator />
											{users?.map((user) => {
												const isSelected = field.value?.includes(user.id);

												return (
													<DropdownMenuCheckboxItem
														key={user.id}
														checked={isSelected}
														onSelect={(e) => e.preventDefault()}
														onCheckedChange={(checked) => {
															const current = field.value ?? [];
															field.onChange(
																checked
																	? [...current, user.id]
																	: current.filter((id) => id !== user.id),
															);
														}}
														className="gap-2 cursor-pointer"
													>
														<Avatar className="size-5">
															<AvatarImage src={user.avatarUrl ?? ""} />
															<AvatarFallback className="text-[9px]">
																{user.name.charAt(0).toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<span className="text-sm">{user.name}</span>
													</DropdownMenuCheckboxItem>
												);
											})}
										</DropdownMenuContent>
									</DropdownMenu>
								</Field>
							);
						}}
					/>

					<Button type="submit" disabled={isPending} className="cursor-pointer">
						Save Changes
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
