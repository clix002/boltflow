import type {
	CreateTaskSchema,
	TaskWithAssigneesSchema,
} from "@scrum-board/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";
import { api } from "@/lib/api";

type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
type TaskWithAssignees = z.infer<typeof TaskWithAssigneesSchema>;

export const useCreateTaskMutation = () => {
	return useMutation({
		mutationFn: (data: CreateTaskInput) =>
			api.post<TaskWithAssignees>("/tasks", data),
		onSuccess: () => {
			toast.success("Task created successfully");
		},
		onError: () => {
			toast.error("Failed to create task");
		},
	});
};
