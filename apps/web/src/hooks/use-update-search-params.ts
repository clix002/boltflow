import { useSearchParams } from "react-router";

export const useUpdateSearchParams = () => {
	const [, setSearchParams] = useSearchParams();

	return (updates: Record<string, string | number | null | undefined>) => {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				for (const [key, value] of Object.entries(updates)) {
					if (value == null || value === "") {
						next.delete(key);
						continue;
					}
					next.set(key, String(value));
				}
				return next;
			},
			{ replace: true },
		);
	};
};
