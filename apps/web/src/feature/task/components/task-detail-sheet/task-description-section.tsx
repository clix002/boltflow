import type { Maybe } from "@scrum-board/shared/types";
import { AlignLeft } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { TaskBlockEditor } from "./task-block-editor";

type TaskDescriptionSectionProps = {
	taskId: string;
	description?: Maybe<string>;
	onDescriptionChange: (serialized: Maybe<string>) => void;
};

export const TaskDescriptionSection = ({
	taskId,
	description,
	onDescriptionChange,
}: TaskDescriptionSectionProps) => {
	return (
		<div className="flex flex-1 flex-col gap-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					<AlignLeft className="size-3.5" />
					<span>Content</span>
				</div>
				<span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70">
					Type <Kbd>/</Kbd> for commands
				</span>
			</div>

			<TaskBlockEditor
				key={taskId}
				initialDescription={description}
				onChange={onDescriptionChange}
			/>
		</div>
	);
};
