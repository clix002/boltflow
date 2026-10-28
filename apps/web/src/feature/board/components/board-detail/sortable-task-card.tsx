import { useSortable } from "@dnd-kit/react/sortable";
import type { TaskWithAssigneesSchema } from "@scrum-board/shared/schemas";
import type { z } from "zod";
import { TaskCard } from "./task-card";

type Task = z.infer<typeof TaskWithAssigneesSchema>;

type SortableTaskCardProps = {
	task: Task;
	index: number;
	onClick?: () => void;
};

export const SortableTaskCard = ({
	task,
	index,
	onClick,
}: SortableTaskCardProps) => {
	const { ref, isDragging } = useSortable({
		id: task.id,
		index,
		group: task.columnId,
	});

	return (
		<TaskCard
			ref={ref}
			task={task}
			variant={isDragging ? "dragging" : "draggable"}
			onClick={onClick}
		/>
	);
};
