import type { BoardSchema } from "@scrum-board/shared/schemas";
import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";
import { api } from "@/lib/api";

type Board = z.infer<typeof BoardSchema>;

export const useGetBoardQuery = (id?: string) => {
	return useQuery({
		queryKey: ["board", id],
		queryFn: () => api.get<Board>(`/boards/${id}`),
		enabled: Boolean(id),
	});
};
