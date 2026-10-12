import { useSearchParams } from "react-router";
import { Input } from "@/components/ui/input";

export const BoardHeader = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const search = searchParams.get("q") ?? "";

	const handleSearch = (value: string) => {
		setSearchParams((prev) => {
			prev.set("q", value);
			return prev;
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
