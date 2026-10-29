import type { Bolt, UpdateBoltInput } from "@scrum-board/shared/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

export type UpdateBoltVariables = {
	boardId: string;
	boltId: string;
	data: UpdateBoltInput;
};

export const useUpdateBoltMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ boardId, boltId, data }: UpdateBoltVariables) =>
			api.patch<Bolt>(`/boards/${boardId}/bolts/${boltId}`, data),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["board", variables.boardId],
			});
			toast.success("Bolt updated");
		},
		onError: () => {
			toast.error("Failed to update Bolt");
		},
	});
};
