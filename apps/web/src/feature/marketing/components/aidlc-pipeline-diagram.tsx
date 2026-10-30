import {
	FolderGit2,
	GitPullRequest,
	Layers,
	type LucideIcon,
} from "lucide-react";

type WorkflowStep = {
	number: string;
	title: string;
	description: string;
	icon: LucideIcon;
	color: string;
	background: string;
};

const WORKFLOW_STEPS = [
	{
		number: "01",
		title: "Connect a repository",
		description:
			"Create a board around the GitHub repository your team already uses.",
		icon: FolderGit2,
		color: "text-indigo-600 dark:text-indigo-400",
		background: "bg-indigo-500/10",
	},
	{
		number: "02",
		title: "Choose a Unit",
		description:
			"Give each area of work a focused Kanban board and its own branch.",
		icon: Layers,
		color: "text-sky-600 dark:text-sky-400",
		background: "bg-sky-500/10",
	},
	{
		number: "03",
		title: "Move toward review",
		description:
			"Track tasks, short Bolts, and GitHub branches through to the PR.",
		icon: GitPullRequest,
		color: "text-emerald-600 dark:text-emerald-400",
		background: "bg-emerald-500/10",
	},
] as const satisfies readonly WorkflowStep[];

export const AidlcPipelineDiagram = () => (
	<ol className="grid gap-0 md:grid-cols-3 md:gap-8">
		{WORKFLOW_STEPS.map((step) => {
			const Icon = step.icon;
			return (
				<li
					key={step.number}
					className="relative border-l border-border/80 pb-10 pl-7 last:pb-0 md:border-t md:border-l-0 md:pt-9 md:pb-0 md:pl-0"
				>
					<span
						className={`absolute -left-1.5 top-0 size-3 rounded-full ${step.background} ring-4 ring-background md:-top-1.5 md:left-0`}
					/>
					<div
						className={`flex size-14 items-center justify-center rounded-2xl ${step.background} ${step.color}`}
					>
						<Icon className="size-7" strokeWidth={1.7} />
					</div>
					<p className="mt-5 font-mono text-xs font-medium tracking-[0.18em] text-muted-foreground">
						{step.number} / 03
					</p>
					<h3 className="mt-2 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
						{step.title}
					</h3>
					<p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
						{step.description}
					</p>
				</li>
			);
		})}
	</ol>
);
