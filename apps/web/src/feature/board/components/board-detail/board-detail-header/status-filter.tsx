import { SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";

export const StatusFilter = () => {
	const [searchParams] = useSearchParams();
	const updateSearchParams = useUpdateSearchParams();
	const statusFilter = searchParams.get("status");

	return (
		<div className="flex items-center gap-2">
			{statusFilter && (
				<Badge
					variant="secondary"
					className="gap-1 rounded-full px-2.5 py-0.5 text-xs font-normal"
				>
					Status: {statusFilter}
					<button
						type="button"
						onClick={() => updateSearchParams({ status: null })}
						className="hover:text-foreground cursor-pointer"
					>
						<X className="size-3" />
					</button>
				</Badge>
			)}

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="icon" className="size-8 rounded-full">
						<SlidersHorizontal className="size-3.5" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Filter by status</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => updateSearchParams({ status: "TODO" })}
					>
						To Do
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => updateSearchParams({ status: "IN_PROGRESS" })}
					>
						In Progress
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => updateSearchParams({ status: "DONE" })}
					>
						Done
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
