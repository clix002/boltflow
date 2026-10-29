import type {
	BoardGitHubInfo,
	GitHubBranch,
	GitHubRepoItem,
	UserGitHubReposResponse,
} from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { Effect } from "effect";
import { HTTPException } from "hono/http-exception";
import { Octokit } from "octokit";
import { env } from "@/config/env";
import { prisma } from "@/db/connections";
import {
	GitHubApiError,
	GitHubBranchNotFoundError,
	InvalidBranchNameError,
} from "./github.errors";
import {
	isHttpStatusError,
	parseRepoCoordinates,
	type RepoCoordinates,
	sanitizeBranchName,
} from "./github.utils";

export type ListBoardBranchesInput = {
	githubRepo: Maybe<string | undefined>;
	defaultBranch?: string;
	githubToken?: Maybe<string | undefined>;
};

export type CreateGitHubBranchInput = {
	githubRepo: Maybe<string | undefined>;
	defaultBranch?: string;
	baseBranch?: Maybe<string | undefined>;
	githubToken?: Maybe<string | undefined>;
	branchName: string;
};

type BranchLookupParams = {
	octokit: Octokit;
	coords: RepoCoordinates;
	branch: string;
};

type CreateRemoteBranchParams = {
	octokit: Octokit;
	coords: RepoCoordinates;
	branchName: string;
	baseBranch: string;
	defaultBranch: string;
};

const createOctokitClient = (
	token?: Maybe<string | undefined>,
): Maybe<Octokit> => {
	const effectiveToken = token || env.GITHUB_TOKEN;
	if (!effectiveToken) {
		return null;
	}
	return new Octokit({ auth: effectiveToken });
};

const getRemoteBranchEffect = Effect.fn("github.getRemoteBranch")(
	(params: BranchLookupParams) =>
		Effect.tryPromise({
			try: () =>
				params.octokit.rest.repos.getBranch({
					owner: params.coords.owner,
					repo: params.coords.repo,
					branch: params.branch,
				}),
			catch: (cause) => {
				if (isHttpStatusError(cause, 404)) {
					return new GitHubBranchNotFoundError({
						owner: params.coords.owner,
						repo: params.coords.repo,
						branch: params.branch,
					});
				}
				return new GitHubApiError({
					message: `Failed to inspect branch '${params.branch}' on ${params.coords.owner}/${params.coords.repo}`,
				});
			},
		}),
);

const resolveBaseBranchCommitEffect = Effect.fn(
	"github.resolveBaseBranchCommit",
)((params: CreateRemoteBranchParams) =>
	getRemoteBranchEffect({
		octokit: params.octokit,
		coords: params.coords,
		branch: params.baseBranch,
	}).pipe(
		Effect.catchTag("GitHubBranchNotFoundError", () =>
			params.baseBranch !== params.defaultBranch
				? getRemoteBranchEffect({
						octokit: params.octokit,
						coords: params.coords,
						branch: params.defaultBranch,
					})
				: Effect.fail(
						new GitHubApiError({
							message: `Default branch '${params.defaultBranch}' not found on ${params.coords.owner}/${params.coords.repo}`,
						}),
					),
		),
		Effect.mapError(
			() =>
				new GitHubApiError({
					message: `Base branch '${params.baseBranch}' (or '${params.defaultBranch}') not found on ${params.coords.owner}/${params.coords.repo}`,
				}),
		),
	),
);

const createRemoteBranchFromDefaultEffect = Effect.fn(
	"github.createRemoteBranchFromDefault",
)(function* (params: CreateRemoteBranchParams) {
	const baseBranch = yield* resolveBaseBranchCommitEffect(params);

	yield* Effect.tryPromise({
		try: () =>
			params.octokit.rest.git.createRef({
				owner: params.coords.owner,
				repo: params.coords.repo,
				ref: `refs/heads/${params.branchName}`,
				sha: baseBranch.data.commit.sha,
			}),
		catch: () =>
			new GitHubApiError({
				message: `Could not create branch '${params.branchName}' on ${params.coords.owner}/${params.coords.repo}`,
			}),
	});

	return params.branchName;
});

const ensureBranchExistsEffect = Effect.fn("github.ensureBranchExists")(
	function* (input: CreateGitHubBranchInput) {
		const cleanBranch = sanitizeBranchName(input.branchName);
		if (!cleanBranch) {
			return yield* new InvalidBranchNameError({ rawName: input.branchName });
		}

		const effectiveRepo = input.githubRepo ?? null;
		const defaultBranch = input.defaultBranch ?? "main";
		const baseBranch = input.baseBranch
			? sanitizeBranchName(input.baseBranch) || defaultBranch
			: defaultBranch;
		const coords = parseRepoCoordinates(effectiveRepo);
		const octokit = createOctokitClient(input.githubToken);

		if (!coords || !octokit) {
			return cleanBranch;
		}

		return yield* getRemoteBranchEffect({
			octokit,
			coords,
			branch: cleanBranch,
		}).pipe(
			Effect.map((res) => res.data.name),
			Effect.catchTag("GitHubBranchNotFoundError", () =>
				createRemoteBranchFromDefaultEffect({
					octokit,
					coords,
					branchName: cleanBranch,
					baseBranch,
					defaultBranch,
				}),
			),
		);
	},
);

const listBranchesEffect = Effect.fn("github.listBranches")(function* (
	input: ListBoardBranchesInput,
): Effect.fn.Return<BoardGitHubInfo> {
	const effectiveRepo = input.githubRepo ?? null;
	const defaultBranch = input.defaultBranch ?? "main";
	const coords = parseRepoCoordinates(effectiveRepo);
	const octokit = createOctokitClient(input.githubToken);
	const hasToken = Boolean(input.githubToken || env.GITHUB_TOKEN);

	if (!coords || !octokit) {
		return {
			repo: effectiveRepo,
			defaultBranch,
			connected: false,
			hasToken,
			branches: [],
		};
	}

	return yield* Effect.tryPromise({
		try: () =>
			octokit.rest.repos.listBranches({
				owner: coords.owner,
				repo: coords.repo,
				per_page: 100,
			}),
		catch: () =>
			new GitHubApiError({
				message: `Could not list branches for ${coords.owner}/${coords.repo}`,
			}),
	}).pipe(
		Effect.map((response): BoardGitHubInfo => {
			const branches: GitHubBranch[] = response.data.map((branch) => ({
				name: branch.name,
				sha: branch.commit.sha,
				isDefault: branch.name === defaultBranch,
				protected: branch.protected,
			}));

			return {
				repo: `${coords.owner}/${coords.repo}`,
				defaultBranch,
				connected: true,
				hasToken,
				branches,
			};
		}),
		Effect.catchTag("GitHubApiError", () =>
			Effect.succeed<BoardGitHubInfo>({
				repo: `${coords.owner}/${coords.repo}`,
				defaultBranch,
				connected: false,
				hasToken,
				branches: [],
			}),
		),
	);
});

const fetchAuthenticatedReposEffect = Effect.fn(
	"github.fetchAuthenticatedRepos",
)((octokit: Octokit) =>
	Effect.tryPromise({
		try: () =>
			octokit.rest.repos.listForAuthenticatedUser({
				sort: "updated",
				per_page: 100,
			}),
		catch: () =>
			new GitHubApiError({
				message:
					"Invalid GitHub Personal Access Token or insufficient permissions",
			}),
	}).pipe(
		Effect.map((response): GitHubRepoItem[] =>
			response.data.map((repo) => ({
				id: repo.id,
				name: repo.name,
				fullName: repo.full_name,
				defaultBranch: repo.default_branch,
				private: repo.private,
			})),
		),
	),
);

async function getUserGitHubToken(userId: string): Promise<Maybe<string>> {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { githubToken: true },
	});
	return user?.githubToken ?? null;
}

export const githubService = {
	getBoardGitHubInfo(input: ListBoardBranchesInput): Promise<BoardGitHubInfo> {
		return Effect.runPromise(listBranchesEffect(input));
	},

	async listUserRepos(userId: string): Promise<UserGitHubReposResponse> {
		const userToken = await getUserGitHubToken(userId);
		const octokit = createOctokitClient(userToken);
		if (!octokit) {
			return { connected: false, repos: [] };
		}

		return Effect.runPromise(
			fetchAuthenticatedReposEffect(octokit).pipe(
				Effect.map((repos) => ({ connected: true, repos })),
				Effect.catchTag("GitHubApiError", () =>
					Effect.succeed({ connected: false, repos: [] }),
				),
			),
		);
	},

	async connectUserToken(
		userId: string,
		githubToken: string,
	): Promise<UserGitHubReposResponse> {
		const octokit = new Octokit({ auth: githubToken });
		const repos = await Effect.runPromise(
			fetchAuthenticatedReposEffect(octokit).pipe(
				Effect.catchTag("GitHubApiError", (err) =>
					Effect.fail(new HTTPException(400, { message: err.message })),
				),
			),
		);

		await prisma.user.update({
			where: { id: userId },
			data: { githubToken },
			select: { id: true },
		});

		return { connected: true, repos };
	},

	async listRepoBranches(
		userId: string,
		githubRepo: string,
	): Promise<BoardGitHubInfo> {
		const userToken = await getUserGitHubToken(userId);
		return Effect.runPromise(
			listBranchesEffect({
				githubRepo,
				githubToken: userToken,
			}),
		);
	},

	ensureBranchExists(input: CreateGitHubBranchInput): Promise<string> {
		return Effect.runPromise(
			ensureBranchExistsEffect(input).pipe(
				Effect.catchTags({
					InvalidBranchNameError: () =>
						Effect.fail(
							new HTTPException(400, { message: "Invalid branch name" }),
						),
					GitHubApiError: (err) =>
						Effect.fail(new HTTPException(502, { message: err.message })),
				}),
			),
		);
	},
};
