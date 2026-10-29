import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { playTaskDeleteSound } from "@/lib/sound.utils";

export const useDeleteTaskMutation = () => {
	return useMutation({
		mutationFn: (id: string) => api.del<void>(`/tasks/${id}`),
		onSuccess: () => {
			playTaskDeleteSound();
			toast.success("Task deleted successfully");
		},
		onError: () => {
			toast.error("Failed to delete task");
		},
	});
};
