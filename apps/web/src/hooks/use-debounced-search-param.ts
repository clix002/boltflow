import type { Maybe } from "@scrum-board/shared/types";
import { debounce } from "es-toolkit";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useUpdateSearchParams } from "./use-update-search-params";

export const SEARCH_DEBOUNCE_MS = 500;

export const useDebouncedSearchParam = (
	key: string,
	delayMs = SEARCH_DEBOUNCE_MS,
	resetPage = false,
) => {
	const [searchParams] = useSearchParams();
	const urlValue = searchParams.get(key) ?? "";
	const [draft, setDraft] = useState<Maybe<string>>(null);
	const updateSearchParams = useUpdateSearchParams();

	const commitSearch = useMemo(
		() =>
			debounce((nextValue: string) => {
				updateSearchParams({
					[key]: nextValue,
					...(resetPage ? { page: null } : {}),
				});
				setDraft(null);
			}, delayMs),
		[key, delayMs, resetPage, updateSearchParams],
	);

	const setValue = (nextValue: string) => {
		setDraft(nextValue);
		commitSearch(nextValue);
	};

	return {
		value: draft ?? urlValue,
		setValue,
	};
};
