import { BoardSchema, paginatedResponseOf } from "@scrum-board/shared/schemas";
import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";
import { api } from "@/lib/api";

type BoardsQueryParams = {
	search?: string;
	page?: number;
};

const BoardResponseSchema = paginatedResponseOf(BoardSchema);
type boardResponse = z.infer<typeof BoardResponseSchema>;

export const useGetBoardsQuery = ({
	page = 1,
	search,
}: BoardsQueryParams = {}) => {
	const normalizedSearch = search?.trim() || undefined;
	return useQuery({
		queryKey: ["boards", { page, search: normalizedSearch }],
		queryFn: () => {
			const query = new URLSearchParams({ page: String(page) });
			if (normalizedSearch) query.set("search", normalizedSearch);
			return api.get<boardResponse>(`/boards?${query}`);
		},
		placeholderData: (p) => p,
	});
};
