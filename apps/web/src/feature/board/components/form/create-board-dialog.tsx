import { zodResolver } from "@hookform/resolvers/zod";
import { CreateBoardSchema } from "@scrum-board/shared/schemas";
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
import { useCreateBoardMutation } from "../../api/use-create-board";

type CreateBoardDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

type formData = z.infer<typeof CreateBoardSchema>;

export const CreateBoardDialog = ({
	open,
	onOpenChange,
}: CreateBoardDialogProps) => {
	const queryClient = useQueryClient();

	const { mutate: createBoard, isPending } = useCreateBoardMutation();

	const form = useForm<formData>({
		resolver: zodResolver(CreateBoardSchema),
		defaultValues: { name: "" },
	});

	const onSubmit = (data: formData) => {
		createBoard(data, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["boards"] });
				form.reset();
				onOpenChange(false);
			},
		});
	};
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Board</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Fill in the details below to create a new board.
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
						Create
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
