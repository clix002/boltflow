import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DND_TYPE } from "../types";

const droppableTableGroupVariants = cva("transition-colors", {
	variants: {
		isDropTarget: {
			true: "bg-primary/5 ring-1 ring-inset ring-primary/30",
			false: "",
		},
	},
	defaultVariants: {
		isDropTarget: false,
	},
});

type DroppableTableGroupProps = {
	columnId: string;
	children: ReactNode;
};

export const DroppableTableGroup = ({
	columnId,
	children,
}: DroppableTableGroupProps) => {
	const { ref, isDropTarget } = useDroppable({
		id: columnId,
		type: DND_TYPE.COLUMN,
		accept: DND_TYPE.TASK,
		collisionPriority: CollisionPriority.Low,
	});

	return (
		<tbody
			ref={ref}
			className={cn(droppableTableGroupVariants({ isDropTarget }))}
		>
			{children}
		</tbody>
	);
};
