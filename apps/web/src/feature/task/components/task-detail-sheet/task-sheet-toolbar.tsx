import { Check, Maximize2, Minimize2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type TaskSheetToolbarProps = {
	columnName?: string;
	isExpanded: boolean;
	isSaving?: boolean;
	hasSavedRecently?: boolean;
	onToggleSize: () => void;
	onDeleteTask?: () => void;
};

export const TaskSheetToolbar = ({
	columnName,
	isExpanded,
	isSaving = false,
	hasSavedRecently = false,
	onToggleSize,
	onDeleteTask,
}: TaskSheetToolbarProps) => {
	return (
		<div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5 pr-12">
			<div className="flex items-center gap-1.5">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								onClick={onToggleSize}
								className="text-muted-foreground hover:text-foreground cursor-pointer"
								aria-label={isExpanded ? "Collapse drawer" : "Expand drawer"}
							>
								{isExpanded ? (
									<Minimize2 className="size-4" />
								) : (
									<Maximize2 className="size-4" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							{isExpanded ? "Collapse to side peek" : "Expand to full view"}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{columnName && (
					<Badge variant="secondary" className="text-[11px] font-medium">
						{columnName}
					</Badge>
				)}
			</div>

			<div className="flex items-center gap-2 text-xs text-muted-foreground">
				{isSaving && (
					<span className="inline-flex items-center gap-1 text-[11px]">
						<Spinner className="size-3" />
						Saving...
					</span>
				)}
				{!isSaving && hasSavedRecently && (
					<span className="inline-flex items-center gap-1 text-[11px] text-emerald-500">
						<Check className="size-3" />
						Saved
					</span>
				)}

				{onDeleteTask && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									onClick={onDeleteTask}
									className="text-muted-foreground hover:text-destructive cursor-pointer"
									aria-label="Delete task"
								>
									<Trash2 className="size-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">Delete task</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
		</div>
	);
};
