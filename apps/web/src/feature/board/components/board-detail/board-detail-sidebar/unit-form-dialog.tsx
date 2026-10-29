import { zodResolver } from "@hookform/resolvers/zod";
import {
	CATALOG_SLUG,
	CreateUnitSchema,
	DEFAULT_UNIT_COLOR,
	trimToNull,
	type Unit,
} from "@scrum-board/shared/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { Check, GitBranch, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import { useCreateUnitMutation } from "@/feature/board/api/use-create-unit";
import { useGetBoardGitHubQuery } from "@/feature/board/api/use-get-board-github";
import { useUpdateUnitMutation } from "@/feature/board/api/use-update-unit";
import { useGetCatalogQuery } from "@/feature/catalog/api/use-get-catalog";
import {
	buildSuggestedUnitBranchName,
	fromOptionalSelectValue,
	SELECT_UNSET_VALUE,
	toOptionalSelectValue,
} from "@/feature/task/components/task-detail-sheet/task-detail.utils";
import { cn } from "@/lib/utils";

type UnitFormDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	boardId: string;
	unit?: Unit;
};

type FormData = z.infer<typeof CreateUnitSchema>;

export const UnitFormDialog = ({
	open,
	onOpenChange,
	boardId,
	unit,
}: UnitFormDialogProps) => {
	const queryClient = useQueryClient();
	const isEditing = Boolean(unit);
	const [isNewBranchMode, setIsNewBranchMode] = useState(false);
	const { data: colorPresets = [] } = useGetCatalogQuery(
		CATALOG_SLUG.UNIT_COLOR,
	);
	const { data: githubInfo } = useGetBoardGitHubQuery(boardId);
	const branches = githubInfo?.branches ?? [];

	const { mutate: createUnit, isPending: isCreating } = useCreateUnitMutation();
	const { mutate: updateUnit, isPending: isUpdating } = useUpdateUnitMutation();
	const isPending = isCreating || isUpdating;

	const form = useForm<FormData>({
		resolver: zodResolver(CreateUnitSchema),
		defaultValues: {
			name: unit?.name ?? "",
			description: unit?.description ?? "",
			color: unit?.color ?? DEFAULT_UNIT_COLOR,
			branchName: unit?.branchName ?? null,
			createBranchOnGitHub: false,
		},
	});

	const handleToggleNewBranchMode = () => {
		const nextMode = !isNewBranchMode;
		setIsNewBranchMode(nextMode);
		form.setValue("createBranchOnGitHub", nextMode);

		if (nextMode && !form.getValues("branchName")) {
			const currentName = trimToNull(form.getValues("name"));
			if (currentName) {
				form.setValue("branchName", buildSuggestedUnitBranchName(currentName));
			}
		}
	};

	const onSubmit = (data: FormData) => {
		if (!boardId) return;

		const onComplete = () => {
			if (data.createBranchOnGitHub) {
				queryClient.invalidateQueries({ queryKey: ["board-github", boardId] });
			}
			onOpenChange(false);
		};

		if (unit) {
			updateUnit(
				{
					boardId,
					unitId: unit.id,
					data: {
						name: data.name,
						description: data.description,
						color: data.color,
						branchName: data.branchName,
						createBranchOnGitHub: Boolean(
							data.branchName && data.createBranchOnGitHub,
						),
					},
				},
				{
					onSuccess: onComplete,
				},
			);
			return;
		}

		createUnit(
			{
				boardId,
				data: {
					name: data.name,
					description: data.description,
					color: data.color ?? DEFAULT_UNIT_COLOR,
					branchName: data.branchName,
					createBranchOnGitHub: Boolean(
						data.branchName && data.createBranchOnGitHub,
					),
				},
			},
			{
				onSuccess: () => {
					form.reset();
					onComplete();
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isEditing
							? "Edit Unit (Sub-Board)"
							: "Create Unit of Work (Sub-Board)"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the domain sub-board name, description, color, or linked GitHub branch."
							: "Create an isolated sub-board for a domain module and optionally link or create its GitHub branch."}
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mt-4 flex flex-col gap-4"
				>
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Unit Name</FieldLabel>
								<Input
									{...field}
									id={field.name}
									placeholder="e.g. Auth & Security, GitHub Sync, Marketing Page"
									aria-invalid={fieldState.invalid}
									autoFocus
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
								<FieldLabel htmlFor={field.name}>Description</FieldLabel>
								<Textarea
									id={field.name}
									name={field.name}
									ref={field.ref}
									onBlur={field.onBlur}
									value={field.value ?? ""}
									onChange={field.onChange}
									placeholder="Briefly describe the scope of this Unit sub-board..."
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						name="branchName"
						control={form.control}
						render={({ field }) => (
							<Field>
								<div className="flex items-center justify-between">
									<FieldLabel className="inline-flex items-center gap-1.5">
										<GitBranch className="size-3.5 text-emerald-500" />
										GitHub Branch (optional)
									</FieldLabel>
									<Button
										type="button"
										variant="ghost"
										size="xs"
										onClick={handleToggleNewBranchMode}
										className="h-5 px-1.5 text-[11px] text-primary cursor-pointer"
									>
										<Plus className="size-3" />
										{isNewBranchMode
											? "Select existing branch"
											: "Create new branch on GitHub"}
									</Button>
								</div>

								{isNewBranchMode ? (
									<Input
										value={field.value ?? ""}
										onChange={(e) => field.onChange(e.target.value)}
										placeholder="feature/unit-name"
										className="font-mono text-xs"
									/>
								) : (
									<Select
										value={toOptionalSelectValue(field.value)}
										onValueChange={(val) =>
											field.onChange(fromOptionalSelectValue(val))
										}
									>
										<SelectTrigger className="w-full font-mono text-xs cursor-pointer">
											<SelectValue placeholder="No linked branch" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem
												value={SELECT_UNSET_VALUE}
												className="text-xs text-muted-foreground cursor-pointer"
											>
												No linked branch
											</SelectItem>
											{field.value &&
												!branches.some((b) => b.name === field.value) && (
													<SelectItem
														value={field.value}
														className="font-mono text-xs cursor-pointer"
													>
														{field.value}
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
								)}
							</Field>
						)}
					/>

					<Controller
						name="color"
						control={form.control}
						render={({ field }) => {
							const activeColor = field.value ?? DEFAULT_UNIT_COLOR;
							return (
								<Field>
									<FieldLabel>Color Preset</FieldLabel>
									<div className="flex flex-wrap items-center gap-2 pt-1">
										{colorPresets.map((preset) => {
											const isSelected = activeColor === preset.value;
											return (
												<Button
													key={preset.value}
													type="button"
													variant="ghost"
													size="icon-xs"
													onClick={() => field.onChange(preset.value)}
													title={preset.label}
													aria-label={preset.label}
													className={cn(
														"size-6 rounded-full p-0 transition-transform cursor-pointer hover:opacity-90",
														isSelected &&
															"ring-2 ring-ring ring-offset-2 ring-offset-background scale-110",
													)}
													style={{ backgroundColor: preset.value }}
												>
													{isSelected && (
														<Check className="size-3.5 text-white" />
													)}
												</Button>
											);
										})}
									</div>
								</Field>
							);
						}}
					/>

					<Button type="submit" disabled={isPending} className="cursor-pointer">
						{isEditing ? "Save Changes" : "Create Unit Sub-Board"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
