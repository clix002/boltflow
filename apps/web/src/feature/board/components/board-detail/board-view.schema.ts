import { CommaSeparatedArray } from "@scrum-board/shared/schemas";
import { uniq } from "es-toolkit";
import { z } from "zod";
import { BOARD_VIEW_MODE } from "./types";

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
});

export type BoardDefault = z.infer<typeof BoardDefaultSchema>;
export type BoardSession = z.infer<typeof BoardSessionSchema>;

const SESSION_PARAM_KEYS = [
	"columns",
	"assigneeIds",
	"view",
	"search",
] as const;

export const hasAnySessionParams = (searchParams: URLSearchParams): boolean =>
	SESSION_PARAM_KEYS.some((key) => searchParams.has(key));

export const defaultToParamUpdates = (
	prefs: BoardDefault,
): Record<string, string | null> => ({
	columns: prefs.columns.length > 0 ? prefs.columns.join(",") : null,
	assigneeIds:
		prefs.assigneeIds.length > 0 ? prefs.assigneeIds.join(",") : null,
	view: prefs.view !== BOARD_VIEW_MODE.GRID ? prefs.view : null,
});
