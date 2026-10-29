import { CommaSeparatedArray } from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { uniq } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import { z } from "zod";
import { BOARD_VIEW_MODE, type BoardViewMode } from "./types";

const SortedIdsSchema = CommaSeparatedArray.transform((arr) =>
	uniq(arr ?? []).sort(),
);

export const BoardViewModeSchema = z
	.enum([BOARD_VIEW_MODE.GRID, BOARD_VIEW_MODE.LIST])
	.catch(BOARD_VIEW_MODE.GRID);

export const BoardDefaultSchema = z.object({
	columns: SortedIdsSchema,
	assigneeIds: SortedIdsSchema,
	view: BoardViewModeSchema,
});

export const BoardSessionSchema = BoardDefaultSchema.extend({
	search: z.string().trim().catch(""),
	unitId: z.string().trim().catch(""),
	boltId: z.string().trim().catch(""),
	branchName: z.string().trim().catch(""),
});

export type BoardDefault = z.infer<typeof BoardDefaultSchema>;
export type BoardSession = z.infer<typeof BoardSessionSchema>;

export const LAYOUT_OVERRIDE = "custom" as const;
export type LayoutOverride = typeof LAYOUT_OVERRIDE;

export type LayoutKey = keyof BoardDefault;
export type SessionParamKey = LayoutKey | "layout";

export const LAYOUT_KEYS: readonly LayoutKey[] = [
	"columns",
	"assigneeIds",
	"view",
];

export type LayoutParamUpdates = Record<LayoutKey, Maybe<string>>;
export type SessionParamUpdates = LayoutParamUpdates & {
	layout: Maybe<LayoutOverride>;
};

export const hasAnyLayoutParams = (searchParams: URLSearchParams): boolean =>
	searchParams.has("layout") ||
	LAYOUT_KEYS.some((key) => searchParams.has(key));

const serializeListParam = (ids: readonly string[]): Maybe<string> => {
	if (isEmpty(ids)) {
		return null;
	}
	return ids.join(",");
};

const serializeViewParam = (view: BoardViewMode): Maybe<string> => {
	if (view === BOARD_VIEW_MODE.GRID) {
		return null;
	}
	return view;
};

export const defaultToParamUpdates = (
	prefs: BoardDefault,
): LayoutParamUpdates => ({
	columns: serializeListParam(prefs.columns),
	assigneeIds: serializeListParam(prefs.assigneeIds),
	view: serializeViewParam(prefs.view),
});

export const sessionToParamUpdates = (
	prefs: BoardDefault,
	isOverride = true,
): SessionParamUpdates => ({
	...defaultToParamUpdates(prefs),
	layout: isOverride ? LAYOUT_OVERRIDE : null,
});
