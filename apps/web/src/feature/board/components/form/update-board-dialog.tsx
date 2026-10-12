import { zodResolver } from "@hookform/resolvers/zod";
import {
	type BoardSchema,
	UpdateBoardSchema,
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
import { useUpdateBoard } from "../../api/use-update-board";

type Board = z.infer<typeof BoardSchema>;
type FormData = z.infer<typeof UpdateBoardSchema>;

type UpdateBoardDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	board: Board;
};

export const UpdateBoardDialog = ({
	open,
	onOpenChange,
	board,
}: UpdateBoardDialogProps) => {
	const queryClient = useQueryClient();

	const { mutate: updateBoard, isPending } = useUpdateBoard();

	const form = useForm<FormData>({
		resolver: zodResolver(UpdateBoardSchema),
		defaultValues: { name: board.name },
	});

	const onSubmit = (data: FormData) => {
		updateBoard(
			{ data, id: board.id },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["boards"] });
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
					<DialogTitle>Update Board</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Fill in the details below to update the board.
				</DialogDescription>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4 mt-4"
				>
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Name</FieldLabel>
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Button type="submit" disabled={isPending}>
						Update
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
