import {
	ArrowLeft,
	CheckCircle2,
	ChevronDown,
	ExternalLink,
	Folder,
	FolderGit2,
	GitBranch,
	Layers,
	Plus,
	Zap,
} from "lucide-react";
import { BoltFlowLogo } from "@/components/logo/boltflow-logo";
import { Badge } from "@/components/ui/badge";
import { HERO_PREVIEW_UNITS } from "../marketing.constants";

export const HeroSidebarPreview = () => {
	return (
		<div className="hidden flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:col-span-3 md:flex">
			<div className="flex h-12 items-center gap-2 border-b border-sidebar-border px-3">
				<ArrowLeft className="size-3.5 text-muted-foreground" />
				<BoltFlowLogo className="size-4 shrink-0" />
				<span className="truncate text-xs font-semibold">
					BoltFlow Workspace
				</span>
			</div>

			<div className="flex flex-col gap-3 p-2.5">
				<div className="rounded-xl border border-sidebar-border bg-card/60 p-2.5">
					<div className="flex items-center justify-between text-xs font-medium">
						<span className="flex items-center gap-1.5 truncate font-mono text-[11px]">
							<FolderGit2 className="size-3.5 shrink-0 text-emerald-500" />
							clix002/boltflow
						</span>
						<ExternalLink className="size-3 text-muted-foreground" />
					</div>
					<div className="mt-1.5 flex items-center justify-between">
						<span className="flex items-center gap-1 text-[10px] text-muted-foreground">
							<GitBranch className="size-2.5 text-emerald-500" />
							GitHub Connected
						</span>
						<Badge
							variant="secondary"
							className="h-4 px-1.5 font-mono text-[9px]"
						>
							staging
						</Badge>
					</div>
				</div>

				<div>
					<div className="mb-1 flex items-center justify-between px-1 text-[10px] font-medium text-muted-foreground">
						<span className="flex items-center gap-1.5">
							<Layers className="size-3 text-primary" />
							Units of Work
						</span>
						<div className="flex items-center gap-1">
							<ChevronDown className="size-3" />
							<Plus className="size-3" />
						</div>
					</div>
					<div className="space-y-1">
						{HERO_PREVIEW_UNITS.map((unit) => (
							<div
								key={unit.name}
								className={
									unit.isActive
										? "rounded-lg bg-sidebar-accent px-2.5 py-1.5 text-sidebar-accent-foreground"
										: "rounded-lg px-2.5 py-1"
								}
							>
								<div
									className={
										unit.isActive
											? "text-[11px] font-medium"
											: "text-[11px] text-muted-foreground"
									}
								>
									{unit.name}
								</div>
								<div className="flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
									<GitBranch className="size-2.5" />
									{unit.branch}
								</div>
							</div>
						))}
					</div>
				</div>

				<div>
					<div className="mb-1 flex items-center justify-between px-1 text-[10px] font-medium text-muted-foreground">
						<span className="flex items-center gap-1.5">
							<Zap className="size-3 text-amber-500" />
							Bolts (Iterations)
						</span>
						<Plus className="size-3" />
					</div>
					<div className="space-y-1">
						<div className="flex items-center justify-between rounded-lg px-2 py-1 text-[11px] text-muted-foreground">
							<span className="flex items-center gap-1.5 truncate">
								<CheckCircle2 className="size-3 text-emerald-500" />
								Bolt #1: Monorepo
							</span>
							<Badge variant="outline" className="h-4 px-1 text-[8px]">
								COMPLETED
							</Badge>
						</div>
						<div className="flex items-center justify-between rounded-lg px-2 py-1 text-[11px]">
							<span className="flex items-center gap-1.5 truncate font-medium">
								<Zap className="size-3 text-amber-500" />
								Bolt #2: Unit Sub-Boards
							</span>
							<Badge
								variant="outline"
								className="h-4 border-emerald-500/40 bg-emerald-500/10 px-1 text-[8px] text-emerald-600 dark:text-emerald-400"
							>
								ACTIVE
							</Badge>
						</div>
					</div>
				</div>

				<div>
					<div className="mb-1 flex items-center justify-between px-1 text-[10px] font-medium text-muted-foreground">
						<span className="flex items-center gap-1.5">
							<GitBranch className="size-3 text-emerald-500" />
							GitHub Branches
							<Badge variant="secondary" className="h-3.5 px-1 text-[9px]">
								13
							</Badge>
						</span>
						<ChevronDown className="size-3" />
					</div>
					<div className="space-y-0.5 pl-1 font-mono text-[10px]">
						<div className="flex items-center justify-between py-0.5 text-emerald-600 dark:text-emerald-400">
							<span>staging</span>
							<Badge variant="secondary" className="h-3.5 px-1 text-[8px]">
								default
							</Badge>
						</div>
						<div className="flex items-center gap-1 pl-2 text-muted-foreground">
							<Folder className="size-2.5 text-emerald-500" />
							<span>feature/</span>
						</div>
						<div className="pl-5 text-emerald-600 dark:text-emerald-400">
							unit-subboard-01
						</div>
						<div className="pl-8 text-primary">↳ feature/model-01</div>
						<div className="pl-8 text-primary">↳ feature/auth-04</div>
					</div>
				</div>
			</div>
		</div>
	);
};
