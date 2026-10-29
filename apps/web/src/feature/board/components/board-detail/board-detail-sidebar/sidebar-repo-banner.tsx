import { buildGitHubRepoUrl } from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { ExternalLink, Settings2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarGroup } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type SidebarRepoBannerProps = {
	repoSlug: Maybe<string>;
	defaultBranch: string;
	connected: boolean;
	onConfigure?: () => void;
};

export const SidebarRepoBanner = ({
	repoSlug,
	defaultBranch,
	connected,
	onConfigure,
}: SidebarRepoBannerProps) => {
	const repoUrl = buildGitHubRepoUrl(repoSlug);

	return (
		<SidebarGroup className="pb-1">
			<div className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-2.5 text-xs">
				<div className="flex items-center justify-between gap-1.5">
					<div className="flex items-center gap-1.5 min-w-0">
						<span
							className={cn(
								"size-2 rounded-full shrink-0",
								connected
									? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"
									: "bg-amber-500",
							)}
						/>
						<span className="font-semibold text-sidebar-foreground truncate">
							{repoSlug ?? "No GitHub repository"}
						</span>
					</div>
					<div className="flex items-center gap-1 shrink-0">
						{repoUrl && (
							<a
								href={repoUrl}
								target="_blank"
								rel="noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors"
								title="Open on GitHub"
							>
								<ExternalLink className="size-3.5" />
							</a>
						)}
						{onConfigure && (
							<Button
								type="button"
								variant="ghost"
								size="icon-xs"
								onClick={onConfigure}
								title="Configure GitHub Repository & Token"
								aria-label="Configure GitHub Repository & Token"
								className="size-5 text-muted-foreground hover:text-foreground cursor-pointer"
							>
								<Settings2 className="size-3.5" />
							</Button>
						)}
					</div>
				</div>
				<div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
					<span className="inline-flex items-center gap-1">
						<Sparkles className="size-3 text-primary" />
						{connected ? "GitHub Connected" : "Click gear to connect"}
					</span>
					<Badge variant="outline" className="h-4 px-1.5 text-[10px]">
						{defaultBranch}
					</Badge>
				</div>
			</div>
		</SidebarGroup>
	);
};
