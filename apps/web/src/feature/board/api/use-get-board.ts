import type { BoardDetailResponseSchema } from "@scrum-board/shared/schemas";
import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";
import { api } from "@/lib/api";
import { parseQueryParams } from "@/lib/query-params";

type BoardDetail = z.infer<typeof BoardDetailResponseSchema>;

export type BoardFilters = {
	search?: string;
	assigneeIds?: string;
};

export const useGetBoardQuery = (
	id?: string,
	filters?: URLSearchParams | BoardFilters,
) => {
	const { params, queryString } = parseQueryParams(filters, [
		"search",
		"assigneeIds",
	]);

	return useQuery({
		queryKey: ["board", id, params],
		queryFn: () => api.get<BoardDetail>(`/boards/${id}${queryString}`),
		enabled: Boolean(id),
		placeholderData: (previous, previousQuery) =>
			previousQuery?.queryKey[1] === id ? previous : undefined,
	});
};
