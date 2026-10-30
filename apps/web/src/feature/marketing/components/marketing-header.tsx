import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import { BoltFlowLogo } from "@/components/logo/boltflow-logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { AUTH_PATH } from "@/feature/auth/auth.constants";
import { useAuthStore } from "@/store/useAuthStore";
import { AWS_AIDLC_URL, GITHUB_PROFILE_URL } from "./marketing.constants";

export const MarketingHeader = () => {
	const { user } = useAuthStore();

	return (
		<header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
				<div className="flex items-center gap-6">
					<Link
						to={AUTH_PATH.HOME}
						className="flex items-center gap-2.5 font-semibold"
					>
						<BoltFlowLogo className="size-7" />
						<span className="hidden text-sm tracking-tight sm:inline">
							BoltFlow
						</span>
					</Link>

					<nav
						aria-label="Main navigation"
						className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex"
					>
						<a
							href="#methodology"
							className="transition-colors hover:text-foreground"
						>
							Why BoltFlow
						</a>
						<a
							href="#architecture"
							className="transition-colors hover:text-foreground"
						>
							GitHub structure
						</a>
						<a
							href="#workflow"
							className="transition-colors hover:text-foreground"
						>
							How it works
						</a>
						<a
							href={AWS_AIDLC_URL}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
						>
							<span>AWS AI-DLC</span>
							<ExternalLink className="size-3" />
						</a>
					</nav>
				</div>

				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<a
							href={GITHUB_PROFILE_URL}
							target="_blank"
							rel="noreferrer"
							aria-label="GitHub profile: clix002"
							title="GitHub profile: clix002"
						>
							<img
								src="/github-mark.svg"
								alt=""
								className="size-4 dark:invert"
							/>
							<span>GitHub</span>
						</a>
					</Button>
					<ModeToggle />
					{user ? (
						<Button size="sm" asChild>
							<Link to={AUTH_PATH.BOARDS}>
								Open Workspace
								<ArrowRight className="size-3.5" />
							</Link>
						</Button>
					) : (
						<>
							<Button
								variant="ghost"
								size="sm"
								className="hidden sm:inline-flex"
								asChild
							>
								<Link to={AUTH_PATH.LOGIN}>Sign in</Link>
							</Button>
							<Button size="sm" asChild>
								<Link to={AUTH_PATH.REGISTER}>Get started</Link>
							</Button>
						</>
					)}
				</div>
			</div>
		</header>
	);
};
