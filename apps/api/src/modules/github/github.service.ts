import type {
	BoardGitHubInfo,
	GitHubBranch,
} from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { Effect } from "effect";
import { HTTPException } from "hono/http-exception";
import { Octokit } from "octokit";
import { env } from "@/config/env";
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
};

export type CreateGitHubBranchInput = {
	githubRepo: Maybe<string | undefined>;
	defaultBranch?: string;
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
	defaultBranch: string;
};

const createOctokitClient = (): Maybe<Octokit> => {
	if (!env.GITHUB_TOKEN) {
		return null;
	}
	return new Octokit({ auth: env.GITHUB_TOKEN });
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

const createRemoteBranchFromDefaultEffect = Effect.fn(
	"github.createRemoteBranchFromDefault",
)(function* (params: CreateRemoteBranchParams) {
	const baseBranch = yield* getRemoteBranchEffect({
		octokit: params.octokit,
		coords: params.coords,
		branch: params.defaultBranch,
	}).pipe(
		Effect.mapError(
			() =>
				new GitHubApiError({
					message: `Default branch '${params.defaultBranch}' not found on ${params.coords.owner}/${params.coords.repo}`,
				}),
		),
	);

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

		const effectiveRepo = input.githubRepo ?? env.GITHUB_REPO ?? null;
		const defaultBranch = input.defaultBranch ?? "main";
		const coords = parseRepoCoordinates(effectiveRepo);
		const octokit = createOctokitClient();

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
					defaultBranch,
				}),
			),
		);
	},
);

const listBranchesEffect = Effect.fn("github.listBranches")(function* (
	input: ListBoardBranchesInput,
): Effect.fn.Return<BoardGitHubInfo> {
	const effectiveRepo = input.githubRepo ?? env.GITHUB_REPO ?? null;
	const defaultBranch = input.defaultBranch ?? "main";
	const coords = parseRepoCoordinates(effectiveRepo);
	const octokit = createOctokitClient();

	if (!coords || !octokit) {
		return {
			repo: effectiveRepo,
			defaultBranch,
			connected: false,
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
				branches,
			};
		}),
		Effect.catchTag("GitHubApiError", () =>
			Effect.succeed<BoardGitHubInfo>({
				repo: `${coords.owner}/${coords.repo}`,
				defaultBranch,
				connected: false,
				branches: [],
			}),
		),
	);
});

export const githubService = {
	getBoardGitHubInfo(input: ListBoardBranchesInput): Promise<BoardGitHubInfo> {
		return Effect.runPromise(listBranchesEffect(input));
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
