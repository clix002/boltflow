import { zodResolver } from "@hookform/resolvers/zod";
import {
	CATALOG_SLUG,
	CreateUnitSchema,
	DEFAULT_UNIT_COLOR,
	type Unit,
} from "@scrum-board/shared/schemas";
import { Check } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateUnitMutation } from "@/feature/board/api/use-create-unit";
import { useUpdateUnitMutation } from "@/feature/board/api/use-update-unit";
import { useGetCatalogQuery } from "@/feature/catalog/api/use-get-catalog";
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
	const isEditing = Boolean(unit);
	const { data: colorPresets = [] } = useGetCatalogQuery(
		CATALOG_SLUG.UNIT_COLOR,
	);
	const { mutate: createUnit, isPending: isCreating } = useCreateUnitMutation();
	const { mutate: updateUnit, isPending: isUpdating } = useUpdateUnitMutation();
	const isPending = isCreating || isUpdating;

	const form = useForm<FormData>({
		resolver: zodResolver(CreateUnitSchema),
		defaultValues: {
			name: unit?.name ?? "",
			description: unit?.description ?? "",
			color: unit?.color ?? DEFAULT_UNIT_COLOR,
		},
	});

	const onSubmit = (data: FormData) => {
		if (!boardId) return;

		const normalizedDescription = data.description?.trim()
			? data.description.trim()
			: null;

		if (unit) {
			updateUnit(
				{
					boardId,
					unitId: unit.id,
					data: {
						name: data.name.trim(),
						description: normalizedDescription,
						color: data.color,
					},
				},
				{
					onSuccess: () => {
						onOpenChange(false);
					},
				},
			);
			return;
		}

		createUnit(
			{
				boardId,
				data: {
					name: data.name.trim(),
					description: normalizedDescription,
					color: data.color ?? DEFAULT_UNIT_COLOR,
				},
			},
			{
				onSuccess: () => {
					form.reset();
					onOpenChange(false);
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Unit of Work" : "Create Unit of Work"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the domain module name, description, or badge color."
							: "Group related tasks into a bounded domain module."}
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
									placeholder="e.g. Core & Schema, GitHub Sync, UI Sidebar"
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
									placeholder="Briefly describe the responsibility of this Unit..."
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
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
						{isEditing ? "Save Changes" : "Create Unit"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
