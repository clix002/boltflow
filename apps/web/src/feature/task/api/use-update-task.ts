import type {
	TaskWithAssigneesSchema,
	UpdateTaskSchema,
} from "@scrum-board/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";
import { api } from "@/lib/api";

type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
type TaskWithAssignees = z.infer<typeof TaskWithAssigneesSchema>;

export type UpdateTaskVariables = {
	id: string;
	data: UpdateTaskInput;
};

export const useUpdateTaskMutation = () => {
	return useMutation({
		mutationFn: ({ id, data }: UpdateTaskVariables) =>
			api.patch<TaskWithAssignees>(`/tasks/${id}`, data),
		onError: () => {
			toast.error("Failed to save task changes");
		},
	});
};
