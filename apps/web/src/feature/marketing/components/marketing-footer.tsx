import { ExternalLink } from "lucide-react";
import { BoltFlowLogo } from "@/components/logo/boltflow-logo";
import { AWS_AIDLC_URL, GITHUB_PROJECT_URL } from "./marketing.constants";

export const MarketingFooter = () => {
	return (
		<footer className="border-t border-border/60 bg-background/80 py-8">
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
				<div className="flex items-center gap-2.5">
					<BoltFlowLogo className="size-5" />
					<span className="font-medium text-foreground">BoltFlow</span>
					<span>— AI-DLC Workspace for GitHub Teams</span>
				</div>

				<div className="flex flex-wrap items-center gap-4">
					<a
						href={AWS_AIDLC_URL}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
					>
						<span>AWS AI-DLC Methodology</span>
						<ExternalLink className="size-3" />
					</a>
					<a
						href={GITHUB_PROJECT_URL}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
					>
						<span>GitHub Repository</span>
						<ExternalLink className="size-3" />
					</a>
				</div>
			</div>
		</footer>
	);
};
