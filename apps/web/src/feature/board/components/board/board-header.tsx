import { startTransition } from "react";
import { useSearchParams } from "react-router";
import { Input } from "@/components/ui/input";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";

export const BoardHeader = () => {
	const [searchParams] = useSearchParams();
	const updateSearchParams = useUpdateSearchParams();
	const search = searchParams.get("q") ?? "";

	const handleSearch = (value: string) => {
		startTransition(() => {
			updateSearchParams({ q: value, page: null });
		});
	};

	return (
		<div className="flex items-center gap-4 w-full">
			<Input
				value={search}
				onChange={(e) => handleSearch(e.target.value)}
				placeholder="Search boards..."
				className="h-8 max-w-xs"
			/>
		</div>
	);
};
