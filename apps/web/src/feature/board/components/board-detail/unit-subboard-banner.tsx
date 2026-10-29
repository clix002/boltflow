import {
	buildGitHubBranchUrl,
	type UnitWithBoard,
} from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { ExternalLink, GitBranch, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type UnitSubboardBannerProps = {
	unit: UnitWithBoard;
	githubRepo?: Maybe<string>;
};

export const UnitSubboardBanner = ({
	unit,
	githubRepo,
}: UnitSubboardBannerProps) => {
	const branchUrl = buildGitHubBranchUrl(githubRepo, unit.branchName);

	return (
		<div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/60 px-4 py-2.5 shadow-xs">
			<div className="flex flex-wrap items-center gap-2.5 min-w-0">
				<div className="flex items-center gap-2 min-w-0">
					<h2 className="text-sm font-semibold tracking-tight text-foreground truncate">
						{unit.name}
					</h2>
					<Badge
						variant="outline"
						className="h-5 gap-1 px-1.5 text-[10px] font-medium text-muted-foreground"
					>
						<Layers className="size-2.5 text-indigo-500" />
						Unit Board
					</Badge>
				</div>

				{unit.description && (
					<span className="hidden md:inline text-xs text-muted-foreground truncate max-w-md">
						— {unit.description}
					</span>
				)}
			</div>

			{unit.branchName && (
				<div className="flex items-center gap-2">
					<Badge
						variant="secondary"
						className="h-6 gap-1.5 px-2 font-mono text-[11px] text-emerald-600 dark:text-emerald-400"
					>
						<GitBranch className="size-3 shrink-0" />
						<span>{unit.branchName}</span>
						{branchUrl && (
							<a
								href={branchUrl}
								target="_blank"
								rel="noreferrer"
								title="Open branch on GitHub"
								className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors"
							>
								<ExternalLink className="size-3" />
							</a>
						)}
					</Badge>
				</div>
			)}
		</div>
	);
};
