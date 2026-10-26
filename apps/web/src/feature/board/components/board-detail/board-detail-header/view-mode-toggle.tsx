import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BOARD_VIEW_MODE } from "@/feature/board/components/board-detail/types";
import { useBoardPreferences } from "@/feature/board/components/board-detail/use-board-preferences";
import { cn } from "@/lib/utils";

export const ViewModeToggle = () => {
	const { currentView, isViewModified, setView } = useBoardPreferences();

	return (
		<div
			className={cn(
				"flex items-center rounded-lg border p-0.5 transition-colors",
				isViewModified && "border-amber-500/40 bg-amber-500/5",
			)}
		>
			<Button
				variant={currentView === BOARD_VIEW_MODE.GRID ? "secondary" : "ghost"}
				size="icon"
				className={cn(
					"size-7 rounded-md cursor-pointer relative",
					currentView === BOARD_VIEW_MODE.GRID
						? "bg-muted text-foreground shadow-xs"
						: "text-muted-foreground hover:text-foreground",
					currentView === BOARD_VIEW_MODE.GRID &&
						isViewModified &&
						"text-amber-600 dark:text-amber-400",
				)}
				onClick={() => setView(BOARD_VIEW_MODE.GRID)}
				aria-label="Grid view"
			>
				<LayoutGrid className="size-3.5" />
				{currentView === BOARD_VIEW_MODE.GRID && isViewModified && (
					<span className="absolute top-1 right-1 size-1.5 rounded-full bg-amber-500" />
				)}
			</Button>
			<Button
				variant={currentView === BOARD_VIEW_MODE.LIST ? "secondary" : "ghost"}
				size="icon"
				className={cn(
					"size-7 rounded-md cursor-pointer relative",
					currentView === BOARD_VIEW_MODE.LIST
						? "bg-muted text-foreground shadow-xs"
						: "text-muted-foreground hover:text-foreground",
					currentView === BOARD_VIEW_MODE.LIST &&
						isViewModified &&
						"text-amber-600 dark:text-amber-400",
				)}
				onClick={() => setView(BOARD_VIEW_MODE.LIST)}
				aria-label="List view"
			>
				<List className="size-3.5" />
				{currentView === BOARD_VIEW_MODE.LIST && isViewModified && (
					<span className="absolute top-1 right-1 size-1.5 rounded-full bg-amber-500" />
				)}
			</Button>
		</div>
	);
};
