import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebouncedSearchParam } from "@/hooks/use-debounced-search-param";

export const TaskSearchInput = () => {
	const { value, setValue } = useDebouncedSearchParam("search");

	return (
		<div className="relative">
			<Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
			<Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Search tasks..."
				className="h-8 w-40 rounded-full pl-8 text-xs transition-all focus:w-56"
			/>
		</div>
	);
};
