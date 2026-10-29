import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { BoltFlowLogo } from "@/components/logo/boltflow-logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export const MarketingHeader = () => {
	const { user } = useAuthStore();

	return (
		<header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
				<Link to="/" className="flex items-center gap-2.5 font-semibold">
					<BoltFlowLogo className="size-7" />
					<span className="text-sm tracking-tight">BoltFlow</span>
				</Link>

				<div className="flex items-center gap-2">
					<ModeToggle />
					{user ? (
						<Button size="sm" asChild>
							<Link to="/boards">
								Open Workspace
								<ArrowRight className="size-3.5" />
							</Link>
						</Button>
					) : (
						<>
							<Button variant="ghost" size="sm" asChild>
								<Link to="/login">Sign in</Link>
							</Button>
							<Button size="sm" asChild>
								<Link to="/register">Get Started</Link>
							</Button>
						</>
					)}
				</div>
			</div>
		</header>
	);
};
