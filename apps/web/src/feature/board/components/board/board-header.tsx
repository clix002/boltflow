import { Input } from "@/components/ui/input";
import {
	SEARCH_DEBOUNCE_MS,
	useDebouncedSearchParam,
} from "@/hooks/use-debounced-search-param";

export const BoardHeader = () => {
	const { value, setValue } = useDebouncedSearchParam(
		"q",
		SEARCH_DEBOUNCE_MS,
		true,
	);

	return (
		<div className="flex items-center gap-4 w-full">
			<Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Search boards..."
				className="h-8 max-w-xs"
			/>
		</div>
	);
};
