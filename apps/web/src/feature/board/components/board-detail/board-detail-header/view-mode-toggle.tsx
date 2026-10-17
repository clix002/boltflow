import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ViewModeToggle = () => {
	return (
		<div className="flex items-center rounded-lg border p-0.5">
			<Button variant="ghost" size="icon" className="size-7 rounded-md">
				<LayoutGrid className="size-3.5" />
			</Button>
			<Button variant="ghost" size="icon" className="size-7 rounded-md">
				<List className="size-3.5 text-muted-foreground" />
			</Button>
		</div>
	);
};
