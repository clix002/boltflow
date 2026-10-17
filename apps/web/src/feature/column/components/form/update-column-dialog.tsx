import { zodResolver } from "@hookform/resolvers/zod";
import {
	type ColumnWithTasksSchema,
	UpdateColumnSchema,
} from "@scrum-board/shared/schemas";
import { useQueryClient } from "@tanstack/react-query";
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
import { useUpdateColumnMutation } from "@/feature/column/api/use-update-column";

type ColumnWithTasks = z.infer<typeof ColumnWithTasksSchema>;

type UpdateColumnDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	column: ColumnWithTasks;
	boardId: string;
};

const FormSchema = UpdateColumnSchema.pick({
	name: true,
});

type FormData = z.infer<typeof FormSchema>;

export const UpdateColumnDialog = ({
	open,
	onOpenChange,
	column,
	boardId,
}: UpdateColumnDialogProps) => {
	const queryClient = useQueryClient();
	const { mutate: updateColumn, isPending } = useUpdateColumnMutation();

	const form = useForm<FormData>({
		resolver: zodResolver(FormSchema),
		defaultValues: { name: column.name },
	});

	const onSubmit = (data: FormData) => {
		if (!column) return;

		updateColumn(
			{
				id: column.id,
				data,
			},
			{
				onSuccess: () => {
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
					<DialogTitle>Edit Column</DialogTitle>
					<DialogDescription>Change the name of this column.</DialogDescription>
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
								<FieldLabel htmlFor={field.name}>Column Name</FieldLabel>
								<Input
									{...field}
									id={field.name}
									placeholder="e.g. In Progress"
									aria-invalid={fieldState.invalid}
									autoFocus
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Button type="submit" disabled={isPending} className="cursor-pointer">
						Save Changes
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
