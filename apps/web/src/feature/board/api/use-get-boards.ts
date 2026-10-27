import { BoardSchema, paginatedResponseOf } from "@scrum-board/shared/schemas";
import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";
import { api } from "@/lib/api";
import { parseQueryParams } from "@/lib/query-params";

type BoardsQueryParams = {
	search?: string;
	page?: number;
	limit?: number;
};

const BoardResponseSchema = paginatedResponseOf(BoardSchema);
type boardResponse = z.infer<typeof BoardResponseSchema>;

export const useGetBoardsQuery = (filters: BoardsQueryParams = {}) => {
	const { params, queryString } = parseQueryParams(filters, [
		"page",
		"limit",
		"search",
	]);

	return useQuery({
		queryKey: ["boards", params],
		queryFn: () => api.get<boardResponse>(`/boards${queryString}`),
		placeholderData: (p) => p,
	});
};
