export const BOARD_VIEW_MODE = {
	GRID: "grid",
	LIST: "list",
} as const;

export type BoardViewMode =
	(typeof BOARD_VIEW_MODE)[keyof typeof BOARD_VIEW_MODE];

export const DND_TYPE = {
	COLUMN: "column",
	TASK: "task",
} as const;

export type BoardPreferences = {
	columns: string[];
	assigneeIds: string[];
	view: BoardViewMode;
};
