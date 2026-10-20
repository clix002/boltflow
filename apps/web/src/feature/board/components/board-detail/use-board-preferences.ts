import { isEqual } from "es-toolkit";
import { useCallback, useSyncExternalStore } from "react";
import { useParams, useSearchParams } from "react-router";
import { toast } from "sonner";
import { storage } from "@/lib/storage";
import {
	BOARD_VIEW_MODE,
	type BoardPreferences,
	type BoardViewMode,
} from "./types";

export const normalizeArray = (
	arr: (string | undefined | null)[] = [],
): string[] =>
	arr
		.filter((item): item is string => Boolean(item))
		.map(String)
		.sort();

export const getBoardPreferencesStorageKey = (boardId: string) =>
	`board_preferences_${boardId}`;

export const getLegacyBoardFiltersStorageKey = (boardId: string) =>
	`board_filters_${boardId}`;

export const getBoardPreferences = (
	boardId?: string,
): BoardPreferences | null => {
	if (!boardId) return null;
	const currentKey = getBoardPreferencesStorageKey(boardId);
	const saved = storage.get<BoardPreferences | null>(currentKey, null);
	if (saved) {
		return {
			columns: Array.isArray(saved.columns) ? saved.columns : [],
			assigneeIds: Array.isArray(saved.assigneeIds) ? saved.assigneeIds : [],
			view:
				saved.view === BOARD_VIEW_MODE.LIST
					? BOARD_VIEW_MODE.LIST
					: BOARD_VIEW_MODE.GRID,
		};
	}

	const legacyKey = getLegacyBoardFiltersStorageKey(boardId);
	const legacy = storage.get<{
		columns?: string[];
		assigneeIds?: string[];
	} | null>(legacyKey, null);
	if (legacy) {
		return {
			columns: Array.isArray(legacy.columns) ? legacy.columns : [],
			assigneeIds: Array.isArray(legacy.assigneeIds) ? legacy.assigneeIds : [],
			view: BOARD_VIEW_MODE.GRID,
		};
	}

	return null;
};

let changeCounter = 0;
const listeners = new Set<() => void>();

export const triggerPreferencesUpdate = () => {
	changeCounter++;
	for (const listener of listeners) {
		listener();
	}
};

const subscribe = (listener: () => void) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};

const getSnapshot = () => changeCounter;

export const saveBoardPreferences = (
	boardId: string,
	preferences: BoardPreferences,
): boolean => {
	const key = getBoardPreferencesStorageKey(boardId);
	const result = storage.set<BoardPreferences>(key, preferences);
	triggerPreferencesUpdate();
	return result;
};

export const useBoardPreferences = (boardIdOverride?: string) => {
	const { boardId: paramBoardId } = useParams<{ boardId: string }>();
	const boardId = boardIdOverride ?? paramBoardId;
	const [searchParams] = useSearchParams();

	useSyncExternalStore(subscribe, getSnapshot, () => 0);

	const storageKey = boardId ? getBoardPreferencesStorageKey(boardId) : null;
	const saved = boardId ? getBoardPreferences(boardId) : null;

	const selectedColumnIds =
		searchParams.get("columns")?.split(",").filter(Boolean) ?? [];
	const selectedUserIds =
		searchParams.get("assigneeIds")?.split(",").filter(Boolean) ?? [];

	const rawView = searchParams.get("view");
	const savedView: BoardViewMode = saved?.view ?? BOARD_VIEW_MODE.GRID;
	const currentView: BoardViewMode =
		rawView === BOARD_VIEW_MODE.LIST || rawView === BOARD_VIEW_MODE.GRID
			? rawView
			: savedView;

	const currentColumns = normalizeArray(selectedColumnIds);
	const currentAssignees = normalizeArray(selectedUserIds);
	const savedColumns = normalizeArray(saved?.columns);
	const savedAssignees = normalizeArray(saved?.assigneeIds);

	const isViewModified = currentView !== savedView;
	const areColumnsModified = !isEqual(currentColumns, savedColumns);
	const areAssigneesModified = !isEqual(currentAssignees, savedAssignees);

	const isModified =
		Boolean(storageKey) &&
		(areColumnsModified || areAssigneesModified || isViewModified);

	const savePreferences = useCallback(() => {
		if (!boardId || !storageKey) return;

		const preferences: BoardPreferences = {
			columns: selectedColumnIds,
			assigneeIds: selectedUserIds,
			view: currentView,
		};

		saveBoardPreferences(boardId, preferences);
		toast.success("Preferences saved as default");
	}, [boardId, storageKey, selectedColumnIds, selectedUserIds, currentView]);

	return {
		boardId,
		storageKey,
		saved,
		savedView,
		currentView,
		selectedColumnIds,
		selectedUserIds,
		currentColumns,
		currentAssignees,
		savedColumns,
		savedAssignees,
		isViewModified,
		areColumnsModified,
		areAssigneesModified,
		isModified,
		savePreferences,
	};
};
