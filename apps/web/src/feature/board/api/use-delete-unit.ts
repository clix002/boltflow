import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { playTaskDeleteSound } from "@/lib/sound.utils";

export type DeleteUnitVariables = {
	boardId: string;
	unitId: string;
};

export const useDeleteUnitMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ boardId, unitId }: DeleteUnitVariables) =>
			api.del(`/boards/${boardId}/units/${unitId}`),
		onSuccess: (_data, variables) => {
			playTaskDeleteSound();
			queryClient.invalidateQueries({
				queryKey: ["board", variables.boardId],
			});
			toast.success("Unit of Work deleted");
		},
		onError: () => {
			toast.error("Failed to delete Unit of Work");
		},
	});
};
