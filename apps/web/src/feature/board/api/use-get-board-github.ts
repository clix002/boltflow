import type { BoardGitHubInfo } from "@scrum-board/shared/schemas";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const getBoardGitHubQueryKey = (boardId?: string) =>
	["board-github", boardId] as const;

export const useGetBoardGitHubQuery = (boardId?: string) => {
	return useQuery({
		queryKey: getBoardGitHubQueryKey(boardId),
		queryFn: () =>
			api.get<BoardGitHubInfo>(`/boards/${boardId}/github/branches`),
		enabled: Boolean(boardId),
	});
};
