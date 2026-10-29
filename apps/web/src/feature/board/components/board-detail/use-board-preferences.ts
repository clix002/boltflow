import { isEqual, pick, xor } from "es-toolkit";
import { useParams, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import {
	type BoardDefault,
	BoardDefaultSchema,
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
		return {
			...saved,
			search: urlSession.search,
			unitId: urlSession.unitId,
			boltId: urlSession.boltId,
			branchName: urlSession.branchName,
		};
	};

	const session = getSession();

	const baseline: BoardDefault = saved ?? SYSTEM_DEFAULT;
	const sessionPrefs: BoardDefault = pick(session, LAYOUT_KEYS);

	const hasDefault = saved !== null;
	const isViewModified = session.view !== baseline.view;
	const isDirty = Boolean(boardId) && !isEqual(sessionPrefs, baseline);
	const clearLayoutOverride = () =>
		updateSearchParams({
			columns: null,
			assigneeIds: null,
			view: null,
			layout: null,
		});

	const updateSession = (partial: Partial<BoardDefault>) => {
		const next = BoardDefaultSchema.parse({ ...sessionPrefs, ...partial });
		if (isEqual(next, baseline)) {
			clearLayoutOverride();
			return;
		}
		updateSearchParams(sessionToParamUpdates(next, true));
	};

	const toggleColumn = (columnId: string) =>
		updateSession({ columns: xor(session.columns, [columnId]) });

	const toggleUser = (userId: string) =>
		updateSession({ assigneeIds: xor(session.assigneeIds, [userId]) });

	const toggleUnit = (unitId: string) =>
		updateSearchParams({
			unitId: session.unitId === unitId ? null : unitId,
		});

	const toggleBolt = (boltId: string) =>
		updateSearchParams({
			boltId: session.boltId === boltId ? null : boltId,
		});

	const toggleBranch = (branchName: string) =>
		updateSearchParams({
			branchName: session.branchName === branchName ? null : branchName,
		});

	const clearContextFilters = () =>
		updateSearchParams({
			unitId: null,
			boltId: null,
			branchName: null,
		});

	const clearColumns = () => updateSession({ columns: [] });

	const clearUsers = () => updateSession({ assigneeIds: [] });

	const clearAll = () => {
		updateSession({ columns: [], assigneeIds: [] });
		clearContextFilters();
	};

	const setView = (view: BoardViewMode) => updateSession({ view });

	const savePreferences = () => {
		if (!boardId) return;
		setDefault(boardId, sessionPrefs);
		clearLayoutOverride();
		toast.success("Saved as default view");
	};

	const forgetDefault = () => {
		if (!boardId) return;
		removeDefault(boardId);
		toast.success("Default view forgotten");
	};

	const resetToDefault = clearLayoutOverride;

	const hasContextFilter = Boolean(
		session.unitId || session.boltId || session.branchName,
	);

	return {
		session,
		currentView: session.view,
		selectedColumnIds: session.columns,
		selectedUserIds: session.assigneeIds,
		selectedUnitId: session.unitId,
		selectedBoltId: session.boltId,
		selectedBranchName: session.branchName,
		hasContextFilter,
		hasDefault,
		isViewModified,
		isDirty,
		isModified: isDirty,
		toggleColumn,
		toggleUser,
		toggleUnit,
		toggleBolt,
		toggleBranch,
		clearContextFilters,
		clearColumns,
		clearUsers,
		clearAll,
		setView,
		savePreferences,
		forgetDefault,
		resetToDefault,
	};
};
