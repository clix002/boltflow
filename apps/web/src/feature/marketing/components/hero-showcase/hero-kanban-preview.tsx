import {
	Calendar,
	ExternalLink,
	Filter,
	GitBranch,
	Layers,
	LayoutGrid,
	List,
	PanelLeft,
	Plus,
	Search,
	Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HERO_PREVIEW_COLUMNS } from "../marketing.constants";

export const HeroKanbanPreview = () => {
	return (
		<div className="relative flex flex-col bg-background md:col-span-9">
			<div className="flex h-12 items-center justify-between border-b border-border px-4">
				<div className="flex items-center gap-2 text-muted-foreground">
					<PanelLeft className="size-4" />
				</div>
				<div className="flex items-center gap-2">
					<div className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 text-[11px] text-muted-foreground">
						<Filter className="size-3" />
						<span>Filter</span>
					</div>
					<div className="hidden items-center rounded-md border border-border bg-card p-0.5 sm:flex">
						<span className="rounded bg-muted p-1">
							<LayoutGrid className="size-3" />
						</span>
						<span className="p-1 text-muted-foreground">
							<List className="size-3" />
						</span>
					</div>
					<div className="hidden h-7 w-36 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 text-[11px] text-muted-foreground sm:flex">
						<Search className="size-3" />
						<span>Search tasks...</span>
					</div>
					<div className="inline-flex h-7 items-center gap-1 rounded-full bg-primary px-2.5 text-[11px] font-medium text-primary-foreground">
						<Plus className="size-3" />
						<span>New</span>
					</div>
				</div>
			</div>

			<div className="relative flex-1 p-3.5">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,128,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,128,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:28px_28px]"
				/>

				<div className="relative z-10 mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/80 bg-card/80 px-3.5 py-2 backdrop-blur-xs">
					<div className="flex items-center gap-2">
						<span className="text-xs font-semibold">Core & Schema</span>
						<Badge
							variant="outline"
							className="h-4.5 gap-1 px-1.5 text-[9px] text-muted-foreground"
						>
							<Layers className="size-2.5 text-primary" />
							Unit Board
						</Badge>
						<span className="hidden text-[11px] text-muted-foreground lg:inline">
							— Data models, CI, and shared schemas
						</span>
					</div>
					<Badge
						variant="secondary"
						className="h-5 gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400"
					>
						<GitBranch className="size-2.5" />
						feature/unit-subboard-01
						<ExternalLink className="size-2.5 text-muted-foreground" />
					</Badge>
				</div>

				<div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
					{HERO_PREVIEW_COLUMNS.map((col) => (
						<div
							key={col.title}
							className="flex flex-col gap-2.5 rounded-2xl border border-border/75 bg-muted/45 p-2.5 backdrop-blur-xs dark:bg-zinc-900/65"
						>
							<div className="flex items-center justify-between">
								<span className="text-xs font-semibold">{col.title}</span>
								<Badge
									variant="secondary"
									className="size-4.5 justify-center p-0 text-[10px]"
								>
									{col.count}
								</Badge>
							</div>

							<Card size="sm" className="gap-2 p-3">
								<div className="flex items-center gap-1.5 text-xs font-medium">
									<span
										className={`size-2 shrink-0 rounded-full ${col.dotClass}`}
									/>
									<span className="truncate">{col.taskTitle}</span>
								</div>
								<p className="line-clamp-2 text-[10px] text-muted-foreground">
									{col.taskDescription}
								</p>
								<div className="flex flex-col gap-1">
									<Badge variant="secondary" className="w-fit gap-1 text-[9px]">
										<Zap className="size-2.5 text-amber-500" />
										{col.boltLabel}
									</Badge>
									<Badge
										variant="secondary"
										className="w-fit gap-1 font-mono text-[9px] text-emerald-600 dark:text-emerald-400"
									>
										<GitBranch className="size-2.5" />
										{col.branchLabel}
									</Badge>
								</div>
								{col.showFooterDate && (
									<div className="flex items-center justify-between border-t border-border/60 pt-2 text-[10px] text-muted-foreground">
										<span className="flex items-center gap-1">
											<Calendar className="size-2.5" />
											Oct 29
										</span>
									</div>
								)}
							</Card>

							<div className="rounded-xl border border-dashed border-border py-1.5 text-center text-[10px] text-muted-foreground">
								+ Add card
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
