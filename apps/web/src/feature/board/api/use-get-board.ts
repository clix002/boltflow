import type { BoardDetailResponseSchema } from "@scrum-board/shared/schemas";
import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";
import { api } from "@/lib/api";

type BoardDetail = z.infer<typeof BoardDetailResponseSchema>;

export const useGetBoardQuery = (
	id?: string,
	searchParams?: URLSearchParams,
) => {
	const query = searchParams?.toString();

	return useQuery({
		queryKey: ["board", id, query],
		queryFn: () =>
			api.get<BoardDetail>(`/boards/${id}${query ? `?${query}` : ""}`),
		enabled: Boolean(id),
	});
};
