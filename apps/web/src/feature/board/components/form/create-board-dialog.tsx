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
import { BoardIconPicker } from "./board-icon-picker";
import { GitHubRepoFields } from "./github-repo-fields";

type CreateBoardDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

type FormData = z.infer<typeof CreateBoardSchema>;

export const CreateBoardDialog = ({
	open,
	onOpenChange,
}: CreateBoardDialogProps) => {
	const queryClient = useQueryClient();

	const { mutate: createBoard, isPending } = useCreateBoardMutation();

	const form = useForm<FormData>({
		resolver: zodResolver(CreateBoardSchema),
		defaultValues: {
			name: "",
			iconUrl: null,
			githubRepo: null,
			defaultBranch: "main",
		},
	});

	const iconUrl = form.watch("iconUrl");
	const githubRepo = form.watch("githubRepo");
	const defaultBranch = form.watch("defaultBranch") ?? "main";

	const onSubmit = (data: FormData) => {
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
					<DialogDescription>
						Create a new workspace board and link it to one of your GitHub
						repositories.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4 mt-4"
				>
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Board Name</FieldLabel>
								<Input
									{...field}
									id={field.name}
									placeholder="e.g. BoltFlow Platform"
									aria-invalid={fieldState.invalid}
									autoFocus
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<BoardIconPicker
						value={iconUrl}
						githubRepo={githubRepo}
						onChange={(nextIcon) => form.setValue("iconUrl", nextIcon)}
					/>

					<GitHubRepoFields
						githubRepo={githubRepo}
						defaultBranch={defaultBranch}
						onRepoChange={(nextRepo, nextDefaultBranch) => {
							form.setValue("githubRepo", nextRepo);
							form.setValue("defaultBranch", nextDefaultBranch);
						}}
						onBranchChange={(nextBranch) => {
							form.setValue("defaultBranch", nextBranch);
						}}
					/>

					<Button type="submit" disabled={isPending} className="cursor-pointer">
						Create Board
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
