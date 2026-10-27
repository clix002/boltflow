import { Search } from "lucide-react";
import { startTransition } from "react";
import { useSearchParams } from "react-router";
import { Input } from "@/components/ui/input";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";

export const TaskSearchInput = () => {
	const [searchParams] = useSearchParams();
	const updateSearchParams = useUpdateSearchParams();
	const search = searchParams.get("search") ?? "";

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const next = e.target.value;
		startTransition(() => {
			updateSearchParams({ search: next });
		});
	};

	return (
		<div className="relative">
			<Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
			<Input
				value={search}
				onChange={handleChange}
				placeholder="Search tasks..."
				className="h-8 w-40 rounded-full pl-8 text-xs transition-all focus:w-56"
			/>
		</div>
	);
};
