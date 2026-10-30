import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { AUTH_PATH } from "@/feature/auth/auth.constants";
import { useAuthStore } from "@/store/useAuthStore";

export const MarketingCta = () => {
	const { user } = useAuthStore();

	return (
		<section className="relative mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-1/4 top-0 h-40 bg-[radial-gradient(ellipse,rgba(79,70,229,0.12),transparent_70%)] blur-2xl"
			/>
			<div className="relative flex flex-col items-start justify-between gap-7 border-t border-primary/25 pt-12 sm:flex-row sm:items-center sm:pt-16">
				<div className="max-w-2xl">
					<p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
						Your next project starts here
					</p>
					<h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
						Bring your repository and your team into focus.
					</h2>
					<p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
						Create a board, choose a Unit of Work, and make progress visible.
					</p>
				</div>
				<Button size="lg" className="gap-2 px-5" asChild>
					<Link to={user ? AUTH_PATH.BOARDS : AUTH_PATH.REGISTER}>
						{user ? "Open your workspace" : "Get started"}
						<ArrowRight className="size-4" />
					</Link>
				</Button>
			</div>
		</section>
	);
};
