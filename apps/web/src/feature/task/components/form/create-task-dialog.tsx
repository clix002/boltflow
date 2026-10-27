import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTaskSchema, PrioritySchema } from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { useQueryClient } from "@tanstack/react-query";
import { isEmpty } from "es-toolkit/compat";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { useGetBoardQuery } from "@/feature/board/api/use-get-board";
import { useCreateTaskMutation } from "@/feature/task/api/use-create-task";
import { useGetUsersQuery } from "@/feature/user/api/use-get-users";
import { PriorityBadge } from "../priority-badge";

type CreateTaskDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	columnId?: Maybe<string>;
	boardId: string;
};

const FormSchema = CreateTaskSchema.pick({
	title: true,
	description: true,
	assigneeIds: true,
}).extend({
	columnId: z.string().min(1, "Please select a column"),
	priority: PrioritySchema.default(PrioritySchema.enum.MEDIUM),
});

type FormInput = z.input<typeof FormSchema>;
type FormOutput = z.output<typeof FormSchema>;

export const CreateTaskDialog = ({
	open,
	onOpenChange,
	columnId,
	boardId,
}: CreateTaskDialogProps) => {
	const queryClient = useQueryClient();
	const { mutate: createTask, isPending } = useCreateTaskMutation();
	const { data: users, isPending: isLoadingUsers } = useGetUsersQuery();
	const { data: board } = useGetBoardQuery(boardId);
	const columns = board?.columns ?? [];

	const form = useForm<FormInput, unknown, FormOutput>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			description: "",
			assigneeIds: [],
			columnId: columnId ?? "",
			priority: PrioritySchema.enum.MEDIUM,
		},
	});

	const onSubmit = (data: FormOutput) => {
		const targetColumnId = columnId || data.columnId;
		if (!targetColumnId) return;

		createTask(
			{
				...data,
				columnId: targetColumnId,
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["board", boardId] });
					form.reset({
						title: "",
						description: "",
						assigneeIds: [],
						columnId: columnId ?? "",
						priority: PrioritySchema.enum.MEDIUM,
					});
					onOpenChange(false);
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Task</DialogTitle>
					<DialogDescription>Add a new task to your board.</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mt-4 flex flex-col gap-4"
				>
					{!columnId && !isEmpty(columns) && (
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
						name="title"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Title</FieldLabel>
								<Input
									{...field}
									id={field.name}
									placeholder="e.g. Implement drag and drop"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						name="description"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel htmlFor={field.name}>
									Description (optional)
								</FieldLabel>
								<Textarea
									{...field}
									id={field.name}
									placeholder="Add more details about this task..."
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

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
									<FieldLabel>Assignees (optional)</FieldLabel>
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
															<Loader2 className="size-4" />
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
						Create Task
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
