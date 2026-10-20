import {
	columnGroupingFeature,
	createCoreRowModel,
	createExpandedRowModel,
	createGroupedRowModel,
	rowExpandingFeature,
	tableFeatures,
} from "@tanstack/react-table";

export const boardTableFeatures = tableFeatures({
	columnGroupingFeature,
	rowExpandingFeature,
	coreRowModel: createCoreRowModel(),
	groupedRowModel: createGroupedRowModel(),
	expandedRowModel: createExpandedRowModel(),
});

export type BoardTableFeatures = typeof boardTableFeatures;
