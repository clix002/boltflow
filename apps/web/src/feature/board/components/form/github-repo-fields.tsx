import { trimToNull } from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import {
	CheckCircle2,
	GitBranch,
	KeyRound,
	Lock,
	RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
	useConnectGitHubTokenMutation,
	useGetGitHubReposQuery,
	useGetRepoBranchesQuery,
} from "@/feature/board/api/use-github-repos";
import {
	fromOptionalSelectValue,
	SELECT_UNSET_VALUE,
	toOptionalSelectValue,
} from "@/feature/task/components/task-detail-sheet/task-detail.utils";

type GitHubRepoFieldsProps = {
	githubRepo: Maybe<string | undefined>;
	defaultBranch: string;
	onRepoChange: (repo: Maybe<string>, defaultBranch: string) => void;
	onBranchChange: (branch: string) => void;
};

export const GitHubRepoFields = ({
	githubRepo,
	defaultBranch,
	onRepoChange,
	onBranchChange,
}: GitHubRepoFieldsProps) => {
	const { data: repoData, isPending: isLoadingRepos } =
		useGetGitHubReposQuery();
	const { mutate: connectToken, isPending: isConnecting } =
		useConnectGitHubTokenMutation();

	const isConnected = Boolean(repoData?.connected);
	const repos = repoData?.repos ?? [];

	const [isEditingToken, setIsEditingToken] = useState(false);
	const [tokenInput, setTokenInput] = useState("");

	const activeRepo = githubRepo || null;
	const { data: branchData, isPending: isLoadingBranches } =
		useGetRepoBranchesQuery(activeRepo);
	const branches = branchData?.branches ?? [];

	const showTokenInput = !isConnected || isEditingToken;

	const handleConnectToken = () => {
		const cleanedToken = trimToNull(tokenInput);
		if (!cleanedToken) return;
		connectToken(
			{ githubToken: cleanedToken },
			{
				onSuccess: (res) => {
					setTokenInput("");
					setIsEditingToken(false);
					if (!activeRepo && res.repos.length > 0) {
						const first = res.repos[0];
						onRepoChange(first.fullName, first.defaultBranch);
					}
				},
			},
		);
	};

	const handleSelectRepo = (value: string) => {
		const nextRepo = fromOptionalSelectValue(value);
		if (!nextRepo) {
			onRepoChange(null, "main");
			return;
		}
		const matched = repos.find((r) => r.fullName === nextRepo);
		onRepoChange(nextRepo, matched?.defaultBranch ?? "main");
	};

	return (
		<div className="flex flex-col gap-3.5 rounded-xl border border-border/60 bg-muted/20 p-3.5">
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-1.5 text-xs font-medium">
					<KeyRound className="size-3.5 text-amber-500" />
					<span>GitHub Integration</span>
					{isConnected && (
						<Badge
							variant="secondary"
							className="h-4 gap-1 px-1.5 text-[10px] text-emerald-600 dark:text-emerald-400"
						>
							<CheckCircle2 className="size-2.5" />
							Connected ({repos.length} repos)
						</Badge>
					)}
				</div>

				{isConnected && (
					<Button
						type="button"
						variant="ghost"
						size="xs"
						onClick={() => setIsEditingToken((prev) => !prev)}
						className="h-5 px-1.5 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
					>
						<RefreshCw className="size-2.5" />
						{isEditingToken ? "Cancel" : "Change Token"}
					</Button>
				)}
			</div>

			{isLoadingRepos ? (
				<div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
					<Spinner className="size-3.5" />
					<span>Checking GitHub connection...</span>
				</div>
			) : showTokenInput ? (
				<Field>
					<FieldLabel className="text-xs">
						GitHub Personal Access Token (PAT)
					</FieldLabel>
					<div className="flex items-center gap-2">
						<Input
							type="password"
							autoComplete="off"
							value={tokenInput}
							onChange={(e) => setTokenInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleConnectToken();
								}
							}}
							placeholder="github_pat_... or ghp_..."
							className="font-mono text-xs"
						/>
						<Button
							type="button"
							variant="secondary"
							size="sm"
							disabled={isConnecting || !trimToNull(tokenInput)}
							onClick={handleConnectToken}
							className="shrink-0 cursor-pointer"
						>
							{isConnecting ? <Spinner className="size-3.5" /> : "Connect"}
						</Button>
					</div>
					<FieldDescription className="text-[11px]">
						Connect your PAT once to load your repositories and branches
						automatically.
					</FieldDescription>
				</Field>
			) : null}

			{isConnected && (
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					<div className="sm:col-span-2">
						<Field>
							<FieldLabel className="text-xs">Repository</FieldLabel>
							<Select
								value={toOptionalSelectValue(activeRepo)}
								onValueChange={handleSelectRepo}
							>
								<SelectTrigger className="w-full font-mono text-xs cursor-pointer">
									<SelectValue placeholder="Select a repository..." />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										value={SELECT_UNSET_VALUE}
										className="text-xs text-muted-foreground cursor-pointer"
									>
										No linked repository
									</SelectItem>
									{activeRepo &&
										!repos.some((r) => r.fullName === activeRepo) && (
											<SelectItem
												value={activeRepo}
												className="font-mono text-xs cursor-pointer"
											>
												{activeRepo}
											</SelectItem>
										)}
									{repos.map((repo) => (
										<SelectItem
											key={repo.id}
											value={repo.fullName}
											className="font-mono text-xs cursor-pointer"
										>
											<span className="inline-flex items-center gap-1.5">
												<span>{repo.fullName}</span>
												{repo.private && (
													<Lock className="size-2.5 text-muted-foreground" />
												)}
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
					</div>

					<Field>
						<FieldLabel className="inline-flex items-center gap-1 text-xs">
							<GitBranch className="size-3 text-emerald-500" />
							Base Branch
						</FieldLabel>
						<Select
							value={defaultBranch || "main"}
							onValueChange={onBranchChange}
							disabled={!activeRepo || isLoadingBranches}
						>
							<SelectTrigger className="w-full font-mono text-xs cursor-pointer">
								<SelectValue placeholder="main" />
							</SelectTrigger>
							<SelectContent>
								{defaultBranch &&
									!branches.some((b) => b.name === defaultBranch) && (
										<SelectItem
											value={defaultBranch}
											className="font-mono text-xs cursor-pointer"
										>
											{defaultBranch}
										</SelectItem>
									)}
								{branches.map((branch) => (
									<SelectItem
										key={branch.name}
										value={branch.name}
										className="font-mono text-xs cursor-pointer"
									>
										{branch.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
				</div>
			)}
		</div>
	);
};
