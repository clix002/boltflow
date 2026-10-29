import type { Bolt, CreateBoltInput } from "@scrum-board/shared/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { playTaskCreateSound } from "@/lib/sound.utils";

export type CreateBoltVariables = {
	boardId: string;
	data: CreateBoltInput;
};

export const useCreateBoltMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ boardId, data }: CreateBoltVariables) =>
			api.post<Bolt>(`/boards/${boardId}/bolts`, data),
		onSuccess: (_data, variables) => {
			playTaskCreateSound();
			queryClient.invalidateQueries({
				queryKey: ["board", variables.boardId],
			});
			toast.success("Bolt created");
		},
		onError: () => {
			toast.error("Failed to create Bolt");
		},
	});
};
