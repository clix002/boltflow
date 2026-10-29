import type {
	BoardGitHubInfo,
	ConnectGitHubTokenInput,
	UserGitHubReposResponse,
} from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const GITHUB_REPOS_QUERY_KEY = ["github-repos"] as const;

export const useGetGitHubReposQuery = (enabled = true) => {
	return useQuery({
		queryKey: GITHUB_REPOS_QUERY_KEY,
		queryFn: () => api.get<UserGitHubReposResponse>("/github/repos"),
		enabled,
	});
};

export const useGetRepoBranchesQuery = (repo?: Maybe<string>) => {
	return useQuery({
		queryKey: ["github-repo-branches", repo] as const,
		queryFn: () =>
			api.get<BoardGitHubInfo>(
				`/github/repos/branches?repo=${encodeURIComponent(repo ?? "")}`,
			),
		enabled: Boolean(repo),
	});
};

export const useConnectGitHubTokenMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ConnectGitHubTokenInput) =>
			api.post<UserGitHubReposResponse>("/github/token", data),
		onSuccess: (data) => {
			queryClient.setQueryData(GITHUB_REPOS_QUERY_KEY, data);
			queryClient.invalidateQueries({ queryKey: ["board-github"] });
			toast.success(
				`Connected to GitHub (${data.repos.length} repositories loaded)`,
			);
		},
		onError: (err) => {
			toast.error(err.message || "Invalid GitHub Personal Access Token");
		},
	});
};
