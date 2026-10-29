import type { Maybe } from "@scrum-board/shared/types";
import { ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SidebarGroup } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type SidebarRepoBannerProps = {
	repoSlug: Maybe<string>;
	defaultBranch: string;
	connected: boolean;
};

export const SidebarRepoBanner = ({
	repoSlug,
	defaultBranch,
	connected,
}: SidebarRepoBannerProps) => {
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
							{repoSlug ?? "No repository"}
						</span>
					</div>
					{repoSlug && (
						<a
							href={`https://github.com/${repoSlug}`}
							target="_blank"
							rel="noreferrer"
							className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
							title="Open on GitHub"
						>
							<ExternalLink className="size-3.5" />
						</a>
					)}
				</div>
				<div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
					<span className="inline-flex items-center gap-1">
						<Sparkles className="size-3 text-primary" />
						{connected ? "GitHub Connected" : "Offline"}
					</span>
					<Badge variant="outline" className="h-4 px-1.5 text-[10px]">
						{defaultBranch}
					</Badge>
				</div>
			</div>
		</SidebarGroup>
	);
};
