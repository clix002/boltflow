import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useBoardPreferences } from "../use-board-preferences";
import { BoardFilter } from "./board-filter";
import { NewEntityDropdown } from "./new-entity-dropdown";
import { TaskSearchInput } from "./task-search-input";
import { ViewModeToggle } from "./view-mode-toggle";

export const BoardDetailHeader = () => {
	const { open } = useSidebar();
	const { isModified, savePreferences } = useBoardPreferences();

	return (
		<div className="flex items-center justify-between gap-4 w-full">
			{!open && (
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold tracking-tight">Board</span>
				</div>
			)}

			<div className="ml-auto flex items-center gap-2">
				{isModified && (
					<Button
						variant="outline"
						size="sm"
						onClick={savePreferences}
						className="rounded-full border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs h-8 gap-1.5 cursor-pointer"
					>
						<Bookmark className="size-3" /> Save changes
					</Button>
				)}
				<BoardFilter />
				<ViewModeToggle />
				<TaskSearchInput />
				<NewEntityDropdown />
			</div>
		</div>
	);
};
