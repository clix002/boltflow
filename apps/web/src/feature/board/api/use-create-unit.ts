import type { CreateUnitInput, Unit } from "@scrum-board/shared/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { playTaskCreateSound } from "@/lib/sound.utils";

export type CreateUnitVariables = {
	boardId: string;
	data: CreateUnitInput;
};

export const useCreateUnitMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ boardId, data }: CreateUnitVariables) =>
			api.post<Unit>(`/boards/${boardId}/units`, data),
		onSuccess: (_data, variables) => {
			playTaskCreateSound();
			queryClient.invalidateQueries({
				queryKey: ["board", variables.boardId],
			});
			toast.success("Unit of Work created");
		},
		onError: () => {
			toast.error("Failed to create Unit of Work");
		},
	});
};
