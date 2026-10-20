import type {
	ColumnWithTasksSchema,
	TaskWithAssigneesSchema,
} from "@scrum-board/shared/schemas";
import type { Row } from "@tanstack/react-table";
import type { z } from "zod";
import type { BoardTableFeatures } from "./table-features";

export type ColumnWithTasks = z.infer<typeof ColumnWithTasksSchema>;
export type TaskWithAssignees = z.infer<typeof TaskWithAssigneesSchema>;

export type TableTaskRow = TaskWithAssignees & {
	columnName: string;
	isEmptyPlaceholder?: boolean;
};

export type TableColumnsProps = {
	onTaskClick?: (taskId: string) => void;
};

export type TableGroupHeaderProps = {
	row: Row<BoardTableFeatures, TableTaskRow>;
	colSpan: number;
	column?: ColumnWithTasks;
	onAddTask?: (columnId: string) => void;
	onEditColumn?: (column: ColumnWithTasks) => void;
	onDeleteColumn?: (columnId: string) => void;
};

export type BoardTableProps = {
	columns: ColumnWithTasks[];
	onTaskClick?: (taskId: string) => void;
	onAddTask?: (columnId: string) => void;
	onEditColumn?: (column: ColumnWithTasks) => void;
	onDeleteColumn?: (columnId: string) => void;
};

export type BoardTableViewProps = BoardTableProps;
