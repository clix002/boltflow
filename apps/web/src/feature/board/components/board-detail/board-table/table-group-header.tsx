import { ChevronDown, ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TableGroupHeaderProps } from "./types";

export const TableGroupHeader = ({
	row,
	colSpan,
	column,
	onAddTask,
	onEditColumn,
	onDeleteColumn,
}: TableGroupHeaderProps) => {
	const isExpanded = row.getIsExpanded();
	const nonPlaceholderSubRows = row.subRows.filter(
		(sub) => !sub.original.isEmptyPlaceholder,
	);
	const taskCount = nonPlaceholderSubRows.length;
	const columnId = column?.id ?? row.subRows[0]?.original.columnId;

	return (
		<tr className="bg-muted/20 border-b border-border/50 hover:bg-muted/30 transition-colors select-none">
			<td colSpan={colSpan} className="py-2.5 px-4">
				<div className="flex items-center justify-between">
					<button
						type="button"
						onClick={row.getToggleExpandedHandler()}
						className="flex items-center gap-2 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md px-1 py-0.5"
					>
						{isExpanded ? (
							<ChevronDown className="size-4 text-muted-foreground transition-transform" />
						) : (
							<ChevronRight className="size-4 text-muted-foreground transition-transform" />
						)}
						<span className="text-xs font-semibold uppercase tracking-wider text-foreground">
							{String(row.groupingValue)}
						</span>
						<Badge
							variant="outline"
							className="h-5 rounded-full px-2 text-[10px] font-medium bg-background text-muted-foreground border-border/60"
						>
							{taskCount}
						</Badge>
					</button>

					<div className="flex items-center gap-1">
						{onAddTask && columnId && (
							<Button
								variant="ghost"
								size="icon"
								className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
								onClick={() => onAddTask(columnId)}
								title="Add task"
								aria-label={`Add task to ${row.groupingValue}`}
							>
								<Plus className="size-3.5" />
							</Button>
						)}
						{(onEditColumn || onDeleteColumn) && column && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
										aria-label="Column actions"
									>
										<MoreHorizontal className="size-3.5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{onEditColumn && (
										<DropdownMenuItem onClick={() => onEditColumn(column)}>
											Edit column
										</DropdownMenuItem>
									)}
									{onDeleteColumn && (
										<DropdownMenuItem
											className="text-destructive focus:text-destructive"
											onClick={() => onDeleteColumn(column.id)}
										>
											Delete column
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>
			</td>
		</tr>
	);
};
