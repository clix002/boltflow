import { useSortable } from "@dnd-kit/react/sortable";
import type { TaskWithAssigneesSchema } from "@scrum-board/shared/schemas";
import type { z } from "zod";
import { CARD_VARIANT } from "@/components/ui/card";
import { TaskCard } from "./task-card";
import { DND_TYPE } from "./types";

type Task = z.infer<typeof TaskWithAssigneesSchema>;

type SortableTaskCardProps = {
	task: Task;
	index: number;
	onClick?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
};

export const SortableTaskCard = ({
	task,
	index,
	onClick,
	onEdit,
	onDelete,
}: SortableTaskCardProps) => {
	const { ref, isDragging } = useSortable({
		id: task.id,
		index,
		group: task.columnId,
		type: DND_TYPE.TASK,
		accept: DND_TYPE.TASK,
	});

	return (
		<TaskCard
			ref={ref}
			task={task}
			variant={isDragging ? CARD_VARIANT.DRAGGING : CARD_VARIANT.DRAGGABLE}
			onClick={onClick}
			onEdit={onEdit}
			onDelete={onDelete}
		/>
	);
};
