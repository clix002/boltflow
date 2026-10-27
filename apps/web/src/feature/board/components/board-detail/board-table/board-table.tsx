import { PrioritySchema } from "@scrum-board/shared/schemas";
import {
	type ExpandedState,
	type GroupingState,
	useTable,
} from "@tanstack/react-table";
import { isEmpty, keyBy } from "es-toolkit/compat";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { tableColumns } from "./columns";
import { boardTableFeatures } from "./table-features";
import { TableGroupHeader } from "./table-group-header";
import type { BoardTableProps, TableTaskRow } from "./types";

export const BoardTable = ({
	columns,
	onTaskClick,
	onAddTask,
	onEditColumn,
	onDeleteColumn,
}: BoardTableProps) => {
	const [expanded, setExpanded] = useState<ExpandedState>(true);
	const [grouping] = useState<GroupingState>(["columnName"]);

	const data = useMemo<TableTaskRow[]>(() => {
		return columns.flatMap((column): TableTaskRow[] => {
			if (isEmpty(column.tasks)) {
				return [
					{
						id: `__placeholder__${column.id}`,
						title: "",
						description: null,
						order: 0,
						priority: PrioritySchema.enum.MEDIUM,
						columnId: column.id,
						columnName: column.name,
						createdAt: "",
						updatedAt: "",
						assignees: [],
						isEmptyPlaceholder: true,
					},
				];
			}

			return column.tasks.map(
				(task): TableTaskRow => ({
					...task,
					columnName: column.name,
					isEmptyPlaceholder: false,
				}),
			);
		});
	}, [columns]);

	const columnMap = keyBy(columns, "id");

	const table = useTable({
		features: boardTableFeatures,
		data,
		columns: tableColumns,
		meta: { onTaskClick },
		state: {
			grouping,
			expanded,
		},
		onExpandedChange: setExpanded,
		autoResetExpanded: false,
		groupedColumnMode: false,
	});

	if (isEmpty(columns)) {
		return (
			<div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
				No columns found. Add a column to view tasks in table view.
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-auto rounded-xl border border-border/50 bg-card custom-scrollbar">
			<table className="w-full border-collapse text-left text-sm">
				<thead className="bg-muted/40 border-b border-border/50 sticky top-0 z-10 backdrop-blur-xs">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className={cn(
										"h-10 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none",
										header.id === "title" && "w-2/5 pl-8",
										header.id === "columnName" && "w-1/6",
										header.id === "assignees" && "w-1/6",
										header.id === "createdAt" && "w-1/6",
										header.id === "actions" && "w-12 text-right pr-4",
									)}
								>
									{header.isPlaceholder ? null : (
										<table.FlexRender header={header} />
									)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => {
						if (row.getIsGrouped()) {
							const columnId = row.subRows[0]?.original.columnId;
							const columnObj = columnId ? columnMap[columnId] : undefined;

							return (
								<TableGroupHeader
									key={row.id}
									row={row}
									colSpan={tableColumns.length}
									column={columnObj}
									onAddTask={onAddTask}
									onEditColumn={onEditColumn}
									onDeleteColumn={onDeleteColumn}
								/>
							);
						}

						if (row.original.isEmptyPlaceholder) {
							return (
								<tr
									key={row.id}
									className="border-b border-border/30 hover:bg-muted/10 transition-colors"
								>
									<td
										colSpan={tableColumns.length}
										className="py-3.5 pl-10 text-xs italic text-muted-foreground"
									>
										No tasks in this column
									</td>
								</tr>
							);
						}

						return (
							<tr
								key={row.id}
								className="group border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
								onClick={() => onTaskClick?.(row.original.id)}
							>
								{row.getAllCells().map((cell) => (
									<td
										key={cell.id}
										className={cn(
											"py-2.5 px-4 text-xs text-foreground align-middle",
											cell.column.id === "title" && "pl-8",
										)}
									>
										<table.FlexRender cell={cell} />
									</td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export const BoardTableView = BoardTable;
