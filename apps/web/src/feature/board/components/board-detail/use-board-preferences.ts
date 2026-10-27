import { isEqual, pick, xor } from "es-toolkit";
import { useParams, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import {
	type BoardDefault,
	type BoardSession,
	BoardSessionSchema,
	hasAnyLayoutParams,
	LAYOUT_KEYS,
	sessionToParamUpdates,
} from "./board-view.schema";
import { BOARD_VIEW_MODE, type BoardViewMode } from "./types";
import {
	selectBoardDefault,
	useBoardDefaultStore,
} from "./use-board-default-store";

const SYSTEM_DEFAULT: BoardDefault = {
	columns: [],
	assigneeIds: [],
	view: BOARD_VIEW_MODE.GRID,
};

export const useBoardPreferences = () => {
	const { boardId } = useParams<{ boardId: string }>();
	const [searchParams] = useSearchParams();
	const updateSearchParams = useUpdateSearchParams();

	const saved = useBoardDefaultStore((state) =>
		selectBoardDefault(state, boardId),
	);
	const setDefault = useBoardDefaultStore((state) => state.setDefault);
	const removeDefault = useBoardDefaultStore((state) => state.removeDefault);

	const urlSession = BoardSessionSchema.parse(Object.fromEntries(searchParams));

	const getSession = (): BoardSession => {
		if (!saved) return urlSession;
		if (hasAnyLayoutParams(searchParams)) return urlSession;
		return { ...saved, search: urlSession.search };
	};

	const session = getSession();

	const baseline: BoardDefault = saved ?? SYSTEM_DEFAULT;
	const sessionPrefs: BoardDefault = pick(session, LAYOUT_KEYS);

	const hasDefault = saved !== null;
	const isViewModified = session.view !== baseline.view;
	const isDirty = Boolean(boardId) && !isEqual(sessionPrefs, baseline);

	const updateSession = (partial: Partial<BoardDefault>) => {
		updateSearchParams(
			sessionToParamUpdates({ ...sessionPrefs, ...partial }, true),
		);
	};

	const toggleColumn = (columnId: string) =>
		updateSession({ columns: xor(session.columns, [columnId]) });

	const toggleUser = (userId: string) =>
		updateSession({ assigneeIds: xor(session.assigneeIds, [userId]) });

	const clearColumns = () => updateSession({ columns: [] });

	const clearUsers = () => updateSession({ assigneeIds: [] });

	const clearAll = () => updateSession({ columns: [], assigneeIds: [] });

	const setView = (view: BoardViewMode) => updateSession({ view });

	const savePreferences = () => {
		if (!boardId) return;
		setDefault(boardId, sessionPrefs);
		toast.success("Saved as default view");
	};

	const forgetDefault = () => {
		if (!boardId) return;
		removeDefault(boardId);
		toast.success("Default view forgotten");
	};

	const resetToDefault = () => {
		updateSearchParams(sessionToParamUpdates(baseline, false));
	};

	return {
		session,
		currentView: session.view,
		selectedColumnIds: session.columns,
		selectedUserIds: session.assigneeIds,
		hasDefault,
		isViewModified,
		isDirty,
		isModified: isDirty,
		toggleColumn,
		toggleUser,
		clearColumns,
		clearUsers,
		clearAll,
		setView,
		savePreferences,
		forgetDefault,
		resetToDefault,
	};
};
