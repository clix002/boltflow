import type {
	MoveTaskSchema,
	TaskWithAssigneesSchema,
} from "@scrum-board/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";
import { api } from "@/lib/api";

type MoveTaskInput = z.infer<typeof MoveTaskSchema>;
type TaskWithAssignees = z.infer<typeof TaskWithAssigneesSchema>;

type MoveTaskVariables = {
	id: string;
	data: MoveTaskInput;
};

export const useMoveTaskMutation = () => {
	return useMutation({
		mutationFn: ({ id, data }: MoveTaskVariables) =>
			api.patch<TaskWithAssignees>(`/tasks/${id}/move`, data),
		onSuccess: () => {
			toast.success("Task moved successfully");
		},
		onError: () => {
			toast.error("Failed to move task");
		},
	});
};
