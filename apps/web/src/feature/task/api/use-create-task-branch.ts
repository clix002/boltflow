import type {
	CreateTaskBranchSchema,
	TaskWithAssigneesSchema,
} from "@scrum-board/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";
import { api } from "@/lib/api";

export type CreateTaskBranchInput = z.infer<typeof CreateTaskBranchSchema>;
export type TaskWithAssigneesResponse = z.infer<typeof TaskWithAssigneesSchema>;

export type CreateTaskBranchVariables = {
	id: string;
	data: CreateTaskBranchInput;
};

export const useCreateTaskBranchMutation = () => {
	return useMutation({
		mutationFn: ({ id, data }: CreateTaskBranchVariables) =>
			api.post<TaskWithAssigneesResponse>(`/tasks/${id}/branch`, data),
		onSuccess: (updatedTask, variables) => {
			const actionLabel = variables.data.createOnGitHub
				? "Created & linked branch"
				: "Linked branch";
			toast.success(`${actionLabel}: ${updatedTask.branchName}`);
		},
		onError: (err) => {
			toast.error(err.message || "Failed to link or create GitHub branch");
		},
	});
};
