import {
	ArrowRight,
	FolderGit2,
	GitBranch,
	Layers,
	ListTodo,
	type LucideIcon,
} from "lucide-react";

type ArchitectureLevel = {
	number: string;
	label: string;
	name: string;
	branch: string;
	branchLabel: string;
	icon: LucideIcon;
	color: string;
};

const ARCHITECTURE_LEVELS = [
	{
		number: "01",
		label: "Board",
		name: "BoltFlow Workspace",
		branch: "staging",
		branchLabel: "base branch",
		icon: FolderGit2,
		color: "text-indigo-500 dark:text-indigo-400",
	},
	{
		number: "02",
		label: "Unit of Work",
		name: "Core & Schema",
		branch: "feature/unit-subboard-01",
		branchLabel: "unit branch",
		icon: Layers,
		color: "text-sky-500 dark:text-sky-400",
	},
	{
		number: "03",
		label: "Task",
		name: "GitHub Actions CI",
		branch: "feature/model-01",
		branchLabel: "task branch",
		icon: ListTodo,
		color: "text-emerald-500 dark:text-emerald-400",
	},
] as const satisfies readonly ArchitectureLevel[];

export const AidlcHierarchyDiagram = () => (
	<div className="relative overflow-hidden border-y border-border/80">
		<div className="hidden grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] gap-3 border-b border-border/70 px-5 py-4 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase sm:grid">
			<span>BoltFlow</span>
			<span />
			<span>GitHub</span>
		</div>
		{ARCHITECTURE_LEVELS.map((level) => {
			const Icon = level.icon;
			return (
				<div
					key={level.number}
					className="grid grid-cols-1 items-center gap-3 border-b border-border/70 py-5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] sm:px-5 sm:py-7"
				>
					<div className="flex min-w-0 items-center gap-3 sm:gap-5">
						<span className="hidden font-mono text-xs text-muted-foreground sm:inline">
							{level.number}
						</span>
						<div
							className={`flex size-10 shrink-0 items-center justify-center rounded-xl border border-current/20 bg-card/70 ${level.color}`}
						>
							<Icon className="size-5" />
						</div>
						<div className="min-w-0">
							<p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
								{level.label}
							</p>
							<p className="mt-0.5 truncate text-sm font-semibold sm:text-base">
								{level.name}
							</p>
						</div>
					</div>
					<ArrowRight
						aria-hidden="true"
						className="ml-3 size-4 rotate-90 text-muted-foreground/70 sm:ml-0 sm:size-5 sm:rotate-0"
					/>
					<div className="ml-3 flex min-w-0 items-center gap-2.5 sm:ml-0">
						<GitBranch className={`size-4 shrink-0 ${level.color}`} />
						<div className="min-w-0">
							<p className="text-[10px] text-muted-foreground">
								{level.branchLabel}
							</p>
							<p
								className="mt-0.5 truncate font-mono text-xs font-medium sm:text-sm"
								title={level.branch}
							>
								{level.branch}
							</p>
						</div>
					</div>
				</div>
			);
		})}
	</div>
);
