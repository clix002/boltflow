import { ArrowRight, Check, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { AUTH_PATH } from "@/feature/auth/auth.constants";
import { useAuthStore } from "@/store/useAuthStore";
import { AWS_AIDLC_URL } from "../marketing.constants";
import { HeroFloatingBoardCard } from "./hero-floating-board-card";
import { HeroKanbanPreview } from "./hero-kanban-preview";
import { HeroSidebarPreview } from "./hero-sidebar-preview";

export const HeroShowcase = () => {
	const { user } = useAuthStore();

	return (
		<section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-130 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(79,70,229,0.12),rgba(16,185,129,0.06)_45%,transparent_100%)]"
			/>

			<div className="mx-auto flex max-w-6xl flex-col items-center px-4 text-center sm:px-6">
				<a
					href={AWS_AIDLC_URL}
					target="_blank"
					rel="noreferrer"
					className="group mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs text-foreground backdrop-blur-sm transition-colors hover:border-primary/50"
				>
					<Sparkles className="size-3.5 text-primary" />
					<span>Built around the AWS AI-DLC methodology</span>
					<ExternalLink className="size-3 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
				</a>

				<h1 className="max-w-4xl font-heading text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
					Give every piece of work{" "}
					<span className="bg-linear-to-r from-primary via-indigo-500 to-sky-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-sky-400 dark:to-emerald-400">
						a clear path to done.
					</span>
				</h1>

				<p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
					BoltFlow brings your GitHub repository, focused work boards, and short
					iterations into one workspace. See what is moving, where it lives in
					Git, and what needs attention next.
				</p>

				<div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
					<Button size="lg" className="w-full gap-2 px-6 sm:w-auto" asChild>
						<Link to={user ? AUTH_PATH.BOARDS : AUTH_PATH.REGISTER}>
							{user ? "Open your workspace" : "Get started"}
							<ArrowRight className="size-4" />
						</Link>
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="w-full gap-2 sm:w-auto"
						asChild
					>
						<a href="#workflow">See how it works</a>
					</Button>
				</div>
				<div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground sm:text-sm">
					<span className="inline-flex items-center gap-1.5">
						<Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />{" "}
						One board per repository
					</span>
					<span className="inline-flex items-center gap-1.5">
						<Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />{" "}
						Focused unit boards
					</span>
					<span className="inline-flex items-center gap-1.5">
						<Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />{" "}
						GitHub branch visibility
					</span>
				</div>

				<div className="relative mt-14 w-full max-w-6xl sm:mt-20 lg:px-6">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-linear-to-tr from-primary/10 via-indigo-500/10 to-emerald-500/10 blur-2xl"
					/>

					<div className="relative overflow-visible rounded-2xl border border-border bg-background text-left text-foreground shadow-xl ring-1 ring-foreground/5">
						<div className="grid grid-cols-1 overflow-hidden rounded-2xl md:grid-cols-12">
							<HeroSidebarPreview />
							<HeroKanbanPreview />
						</div>

						<HeroFloatingBoardCard />
					</div>
				</div>
			</div>
		</section>
	);
};
