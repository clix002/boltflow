import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { playTaskDeleteSound } from "@/lib/sound.utils";

export type DeleteBoltVariables = {
	boardId: string;
	boltId: string;
};

export const useDeleteBoltMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ boardId, boltId }: DeleteBoltVariables) =>
			api.del(`/boards/${boardId}/bolts/${boltId}`),
		onSuccess: (_data, variables) => {
			playTaskDeleteSound();
			queryClient.invalidateQueries({
				queryKey: ["board", variables.boardId],
			});
			toast.success("Bolt deleted");
		},
		onError: () => {
			toast.error("Failed to delete Bolt");
		},
	});
};
