import { FolderGit2, Layers, MoreHorizontal, Zap } from "lucide-react";
import { BoltFlowLogo } from "@/components/logo/boltflow-logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const HeroFloatingBoardCard = () => {
	return (
		<Card className="hidden min-h-34 flex-row gap-0 py-0 text-left shadow-xl ring-1 ring-foreground/10 lg:absolute lg:-right-8 lg:-bottom-10 lg:z-30 lg:flex lg:w-96">
			<div className="flex w-1/3 shrink-0 items-center justify-center border-r border-border/60 bg-muted/30 p-3">
				<BoltFlowLogo className="size-20" />
			</div>
			<div className="flex min-w-0 flex-1 flex-col justify-between">
				<CardHeader className="flex flex-col gap-1.5 py-3.5">
					<div className="flex w-full items-center justify-between gap-2">
						<CardTitle className="truncate text-sm">
							BoltFlow Workspace
						</CardTitle>
						<MoreHorizontal className="size-4 text-muted-foreground" />
					</div>
					<div className="flex items-center gap-1.5">
						<FolderGit2 className="size-3.5 text-emerald-500" />
						<span className="truncate font-mono text-[11px] text-muted-foreground">
							clix002/boltflow
						</span>
						<Badge
							variant="secondary"
							className="h-4 px-1.5 font-mono text-[9px]"
						>
							staging
						</Badge>
					</div>
				</CardHeader>
				<CardFooter className="flex items-center justify-between rounded-none rounded-br-xl border-t bg-muted/40 py-2 text-[11px] text-muted-foreground">
					<div className="flex items-center gap-2.5">
						<span className="inline-flex items-center gap-1">
							<Layers className="size-3" />4 Units
						</span>
						<span className="inline-flex items-center gap-1">
							<Zap className="size-3 text-amber-500" />3 Active Bolts
						</span>
					</div>
					<span className="text-[10px]">10/29/2026</span>
				</CardFooter>
			</div>
		</Card>
	);
};
