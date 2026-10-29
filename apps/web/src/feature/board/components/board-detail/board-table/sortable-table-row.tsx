import { useSortable } from "@dnd-kit/react/sortable";
import { flexRender, type Row } from "@tanstack/react-table";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";
import { DND_TYPE } from "../types";
import type { BoardTableFeatures } from "./table-features";
import type { TableTaskRow } from "./types";

export const TABLE_ROW_VARIANT = {
	DEFAULT: "default",
	DRAGGABLE: "draggable",
	DRAGGING: "dragging",
} as const;

export type TableRowVariant =
	(typeof TABLE_ROW_VARIANT)[keyof typeof TABLE_ROW_VARIANT];

const tableRowVariants = cva(
	"group border-b border-border/30 transition-colors",
	{
		variants: {
			variant: {
				[TABLE_ROW_VARIANT.DEFAULT]: "hover:bg-muted/30 cursor-pointer",
				[TABLE_ROW_VARIANT.DRAGGABLE]:
					"hover:bg-muted/30 cursor-grab active:cursor-grabbing",
				[TABLE_ROW_VARIANT.DRAGGING]:
					"opacity-40 bg-primary/5 border-dashed border-primary/50 cursor-grabbing",
			},
		},
		defaultVariants: {
			variant: TABLE_ROW_VARIANT.DEFAULT,
		},
	},
);

type TaskTableRowProps = {
	row: Row<BoardTableFeatures, TableTaskRow>;
	variant?: VariantProps<typeof tableRowVariants>["variant"];
	onClick?: () => void;
	ref?: React.Ref<HTMLTableRowElement>;
};

export const TaskTableRow = ({
	row,
	variant,
	onClick,
	ref,
}: TaskTableRowProps) => {
	return (
		<tr
			ref={ref}
			className={cn(tableRowVariants({ variant }))}
			onClick={onClick}
		>
			{row.getAllCells().map((cell) => (
				<td
					key={cell.id}
					className={cn(
						"py-2.5 px-4 text-xs text-foreground align-middle",
						cell.column.id === "title" && "pl-8",
					)}
				>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</td>
			))}
		</tr>
	);
};

type SortableTableRowProps = {
	row: Row<BoardTableFeatures, TableTaskRow>;
	index: number;
	onTaskClick?: (taskId: string) => void;
};

export const SortableTableRow = ({
	row,
	index,
	onTaskClick,
}: SortableTableRowProps) => {
	const task = row.original;
	const { ref, isDragging } = useSortable({
		id: task.id,
		index,
		group: task.columnId,
		type: DND_TYPE.TASK,
		accept: DND_TYPE.TASK,
	});

	return (
		<TaskTableRow
			ref={ref}
			row={row}
			variant={
				isDragging ? TABLE_ROW_VARIANT.DRAGGING : TABLE_ROW_VARIANT.DRAGGABLE
			}
			onClick={() => onTaskClick?.(task.id)}
		/>
	);
};
