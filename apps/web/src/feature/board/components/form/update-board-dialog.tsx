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
import { BoardIconPicker } from "./board-icon-picker";
import { GitHubRepoFields } from "./github-repo-fields";

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
		defaultValues: {
			name: board.name,
			iconUrl: board.iconUrl ?? null,
			githubRepo: board.githubRepo ?? null,
			defaultBranch: board.defaultBranch ?? "main",
		},
	});

	const iconUrl = form.watch("iconUrl");
	const githubRepo = form.watch("githubRepo");
	const defaultBranch = form.watch("defaultBranch") ?? "main";

	const onSubmit = (data: FormData) => {
		updateBoard(
			{ data, id: board.id },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["boards"] });
					queryClient.invalidateQueries({ queryKey: ["board", board.id] });
					queryClient.invalidateQueries({
						queryKey: ["board-github", board.id],
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
					<DialogTitle>Board &amp; GitHub Settings</DialogTitle>
					<DialogDescription>
						Select your GitHub repository and base branch for this board.
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
									value={field.value ?? ""}
									id={field.name}
									aria-invalid={fieldState.invalid}
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
						repoLocked={Boolean(board.githubRepo)}
						onRepoChange={(nextRepo, nextDefaultBranch) => {
							form.setValue("githubRepo", nextRepo);
							form.setValue("defaultBranch", nextDefaultBranch);
						}}
						onBranchChange={(nextBranch) => {
							form.setValue("defaultBranch", nextBranch);
						}}
					/>

					<Button type="submit" disabled={isPending} className="cursor-pointer">
						Save Settings
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
