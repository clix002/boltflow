import { Bookmark, BookmarkCheck, RotateCcw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useBoardPreferences } from "../use-board-preferences";
import { BoardFilter } from "./board-filter";
import { NewEntityDropdown } from "./new-entity-dropdown";
import { TaskSearchInput } from "./task-search-input";
import { ViewModeToggle } from "./view-mode-toggle";

export const BoardDetailHeader = () => {
	const { open } = useSidebar();
	const {
		isDirty,
		hasDefault,
		savePreferences,
		forgetDefault,
		resetToDefault,
	} = useBoardPreferences();

	return (
		<div className="flex items-center justify-between gap-4 w-full">
			{!open && (
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold tracking-tight">Board</span>
				</div>
			)}

			<div className="ml-auto flex items-center gap-2">
				{isDirty ? (
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="sm"
							onClick={savePreferences}
							className="rounded-full border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs h-8 gap-1.5 cursor-pointer"
							title="Save current view and filters as board default"
						>
							<Bookmark className="size-3" /> Save as default
						</Button>
						{hasDefault && (
							<Button
								variant="ghost"
								size="icon"
								onClick={resetToDefault}
								className="size-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
								title="Restore saved default view"
							>
								<RotateCcw className="size-3.5" />
							</Button>
						)}
					</div>
				) : (
					hasDefault && (
						<Badge
							variant="outline"
							className="gap-1 border-border/60 bg-muted/40 pl-2.5 pr-1 py-0.5 text-[11px] font-normal text-muted-foreground"
						>
							<BookmarkCheck className="size-3 text-primary" />
							<span>Default view</span>
							<Button
								type="button"
								variant="ghost"
								size="icon-xs"
								onClick={forgetDefault}
								className="ml-0.5 size-4 rounded-full hover:bg-muted hover:text-foreground cursor-pointer"
								title="Forget default view"
								aria-label="Forget default view"
							>
								<X className="size-3" />
							</Button>
						</Badge>
					)
				)}
				<BoardFilter />
				<ViewModeToggle />
				<TaskSearchInput />
				<NewEntityDropdown />
			</div>
		</div>
	);
};
