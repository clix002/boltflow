import type { BoardSchema } from "@scrum-board/shared/schemas";
import { FolderGit2, Layers, MoreHorizontal, Zap } from "lucide-react";
import type { z } from "zod";
import { BoltFlowLogo } from "@/components/logo/boltflow-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

type BoardCardProps = {
	board: z.infer<typeof BoardSchema>;
	onEdit: () => void;
	onDelete: () => void;
	onOpen: () => void;
};

export const BoardCard = ({
	board,
	onEdit,
	onDelete,
	onOpen,
}: BoardCardProps) => {
	const unitCount = board.unitCount ?? 0;
	const activeBoltCount = board.activeBoltCount ?? 0;

	return (
		<Card
			onClick={onOpen}
			className="cursor-pointer flex-row gap-0 py-0 min-h-40 bg-card/90 backdrop-blur-xs transition-all hover:bg-card hover:ring-foreground/20 hover:shadow-lg"
		>
			<div className="flex w-1/3 shrink-0 items-center justify-center border-r border-border/60 bg-muted/25 p-2.5">
				{board.iconUrl ? (
					<img
						src={board.iconUrl}
						alt={board.name}
						className="size-28 max-h-full max-w-full rounded-xl object-contain transition-transform duration-200 group-hover/card:scale-105"
					/>
				) : (
					<BoltFlowLogo className="size-28 max-h-full max-w-full transition-transform duration-200 group-hover/card:scale-105" />
				)}
			</div>
			<div className="flex min-w-0 flex-1 flex-col justify-between">
				<CardHeader className="flex flex-col gap-2 py-4">
					<div className="flex w-full items-start justify-between gap-2">
						<CardTitle className="truncate leading-tight">
							{board.name}
						</CardTitle>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon-xs"
									onClick={(e) => e.stopPropagation()}
									className="shrink-0"
								>
									<MoreHorizontal className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								onClick={(e) => e.stopPropagation()}
							>
								<DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
								<DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{board.githubRepo ? (
						<div className="flex items-center gap-1.5 min-w-0">
							<FolderGit2 className="size-3.5 shrink-0 text-emerald-400" />
							<span className="truncate font-mono text-xs text-muted-foreground">
								{board.githubRepo}
							</span>
							{board.defaultBranch && (
								<Badge
									variant="secondary"
									className="h-4 shrink-0 px-1.5 font-mono text-[10px]"
								>
									{board.defaultBranch}
								</Badge>
							)}
						</div>
					) : (
						<span className="text-xs text-muted-foreground/70">
							No repository linked
						</span>
					)}
				</CardHeader>

				<CardFooter className="flex items-center justify-between gap-2 rounded-none rounded-br-xl border-t bg-muted/40 py-2.5 text-xs text-muted-foreground">
					<div className="flex items-center gap-3">
						<span className="inline-flex items-center gap-1">
							<Layers className="size-3.5 text-muted-foreground/80" />
							<span>
								{unitCount} {unitCount === 1 ? "Unit" : "Units"}
							</span>
						</span>
						<span className="inline-flex items-center gap-1">
							<Zap className="size-3.5 text-amber-400" />
							<span>
								{activeBoltCount} Active{" "}
								{activeBoltCount === 1 ? "Bolt" : "Bolts"}
							</span>
						</span>
					</div>
					<span className="shrink-0 text-[11px] text-muted-foreground/70">
						{new Date(board.updatedAt).toLocaleDateString()}
					</span>
				</CardFooter>
			</div>
		</Card>
	);
};

BoardCard.Skeleton = () => {
	return <Skeleton className="h-40 rounded-xl" />;
};
