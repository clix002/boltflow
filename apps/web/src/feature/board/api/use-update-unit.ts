import type { Unit, UpdateUnitInput } from "@scrum-board/shared/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

export type UpdateUnitVariables = {
	boardId: string;
	unitId: string;
	data: UpdateUnitInput;
};

export const useUpdateUnitMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ boardId, unitId, data }: UpdateUnitVariables) =>
			api.patch<Unit>(`/boards/${boardId}/units/${unitId}`, data),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["board", variables.boardId],
			});
			toast.success("Unit of Work updated");
		},
		onError: () => {
			toast.error("Failed to update Unit of Work");
		},
	});
};
