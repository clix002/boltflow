import { isEqual, pick, xor } from "es-toolkit";
import { useParams, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import {
	type BoardDefault,
	type BoardSession,
	BoardSessionSchema,
	defaultToParamUpdates,
	hasAnySessionParams,
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
	const interactedBoardId = useBoardDefaultStore(
		(state) => state.interactedBoardId,
	);
	const setDefault = useBoardDefaultStore((state) => state.setDefault);
	const removeDefault = useBoardDefaultStore((state) => state.removeDefault);
	const setInteractedBoard = useBoardDefaultStore(
		(state) => state.setInteractedBoard,
	);

	const urlSession = BoardSessionSchema.parse(Object.fromEntries(searchParams));

	const getSession = (): BoardSession => {
		if (!saved) return urlSession;
		if (interactedBoardId === boardId) return urlSession;
		if (hasAnySessionParams(searchParams)) return urlSession;
		return { ...saved, search: "" };
	};

	const session = getSession();

	const baseline: BoardDefault = saved ?? SYSTEM_DEFAULT;
	const sessionPrefs: BoardDefault = pick(session, [
		"columns",
		"assigneeIds",
		"view",
	]);

	const hasDefault = saved !== null;
	const isViewModified = session.view !== baseline.view;
	const isDirty = Boolean(boardId) && !isEqual(sessionPrefs, baseline);

	const updateSession = (partial: Partial<BoardDefault>) => {
		if (boardId) {
			setInteractedBoard(boardId);
		}
		updateSearchParams(defaultToParamUpdates({ ...sessionPrefs, ...partial }));
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
		setInteractedBoard(boardId);
		removeDefault(boardId);
		toast.success("Default view forgotten");
	};

	const resetToDefault = () => {
		setInteractedBoard(null);
		updateSearchParams(defaultToParamUpdates(baseline));
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
