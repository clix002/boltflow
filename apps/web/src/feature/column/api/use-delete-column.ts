import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { playTaskDeleteSound } from "@/lib/sound.utils";

export const useDeleteColumnMutation = () => {
	return useMutation({
		mutationFn: (id: string) => api.del(`/columns/${id}`),
		onSuccess: () => {
			playTaskDeleteSound();
			toast.success("Column deleted successfully");
		},
		onError: () => {
			toast.error("Failed to delete column");
		},
	});
};
