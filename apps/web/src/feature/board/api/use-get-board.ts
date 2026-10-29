import type { BoardDetailResponseSchema } from "@scrum-board/shared/schemas";
import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";
import { api } from "@/lib/api";
import { parseQueryParams } from "@/lib/query-params";

type BoardDetail = z.infer<typeof BoardDetailResponseSchema>;

export type BoardFilters = {
	search?: string;
	assigneeIds?: string;
	unitId?: string;
	boltId?: string;
	branchName?: string;
};

const BOARD_FILTER_KEYS = [
	"search",
	"assigneeIds",
	"unitId",
	"boltId",
	"branchName",
] as const;

export const getBoardQueryKey = (
	id?: string,
	filters?: URLSearchParams | BoardFilters,
) =>
	["board", id, parseQueryParams(filters, BOARD_FILTER_KEYS).params] as const;

export const useGetBoardQuery = (
	id?: string,
	filters?: URLSearchParams | BoardFilters,
) => {
	const { queryString } = parseQueryParams(filters, BOARD_FILTER_KEYS);

	return useQuery({
		queryKey: getBoardQueryKey(id, filters),
		queryFn: () => api.get<BoardDetail>(`/boards/${id}${queryString}`),
		enabled: Boolean(id),
		placeholderData: (previous, previousQuery) =>
			previousQuery?.queryKey[1] === id ? previous : undefined,
	});
};
