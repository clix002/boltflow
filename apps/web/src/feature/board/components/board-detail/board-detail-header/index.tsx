import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { StatusFilter } from "./status-filter";
import { TaskSearchInput } from "./task-search-input";
import { ViewModeToggle } from "./view-mode-toggle";

export const BoardDetailHeader = () => {
	const { open } = useSidebar();

	return (
		<div className="flex items-center justify-between gap-4 w-full">
			{!open && (
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold tracking-tight">Board</span>
				</div>
			)}

			<div className="ml-auto flex items-center gap-2">
				<StatusFilter />
				<ViewModeToggle />
				<TaskSearchInput />

				<Button size="sm" className="h-8 gap-1 rounded-full px-3 text-xs">
					<Plus className="size-3.5" />
					New
				</Button>
			</div>
		</div>
	);
};
