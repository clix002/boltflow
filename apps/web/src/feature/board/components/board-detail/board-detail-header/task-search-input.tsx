import { Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { Input } from "@/components/ui/input";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";

export const TaskSearchInput = () => {
	const [searchParams] = useSearchParams();
	const updateSearchParams = useUpdateSearchParams();
	const search = searchParams.get("search") ?? "";

	return (
		<div className="relative">
			<Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
			<Input
				value={search}
				onChange={(e) => updateSearchParams({ search: e.target.value })}
				placeholder="Search tasks..."
				className="h-8 w-40 rounded-full pl-8 text-xs transition-all focus:w-56"
			/>
		</div>
	);
};
