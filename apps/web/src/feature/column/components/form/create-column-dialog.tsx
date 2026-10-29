import { zodResolver } from "@hookform/resolvers/zod";
import { CreateColumnSchema } from "@scrum-board/shared/schemas";
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
import { useCreateColumnMutation } from "@/feature/column/api/use-create-column";

type CreateColumnDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	boardId: string;
	unitId: string;
};

const FormSchema = CreateColumnSchema.pick({
	name: true,
});

type FormData = z.infer<typeof FormSchema>;

export const CreateColumnDialog = ({
	open,
	onOpenChange,
	boardId,
	unitId,
}: CreateColumnDialogProps) => {
	const queryClient = useQueryClient();
	const { mutate: createColumn, isPending } = useCreateColumnMutation();

	const form = useForm<FormData>({
		resolver: zodResolver(FormSchema),
		defaultValues: { name: "" },
	});

	const onSubmit = (data: FormData) => {
		if (!boardId || !unitId) return;

		createColumn(
			{
				...data,
				unitId,
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["board", boardId] });
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
					<DialogTitle>Create Column</DialogTitle>
					<DialogDescription>
						Add a new column to organize tasks in this board.
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
								<FieldLabel htmlFor={field.name}>Column Name</FieldLabel>
								<Input
									{...field}
									id={field.name}
									placeholder="e.g. QA, Backlog, Ready for Dev"
									aria-invalid={fieldState.invalid}
									autoFocus
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Button type="submit" disabled={isPending} className="cursor-pointer">
						Create Column
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
