import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import type { Maybe } from "@scrum-board/shared/types";
import { resolveTheme, useTheme } from "@/components/theme-provider";
import {
	parseTaskEditorBlocks,
	serializeTaskEditorBlocks,
} from "./task-detail.utils";

type TaskBlockEditorProps = {
	initialDescription?: Maybe<string>;
	onChange: (serializedDescription: Maybe<string>) => void;
};

export const TaskBlockEditor = ({
	initialDescription,
	onChange,
}: TaskBlockEditorProps) => {
	const { theme } = useTheme();
	const initialBlocks = parseTaskEditorBlocks(initialDescription);

	const editor = useCreateBlockNote({
		initialContent: initialBlocks ?? undefined,
		trailingBlock: true,
	});

	const handleEditorChange = () => {
		const serialized = serializeTaskEditorBlocks(editor.document);
		onChange(serialized);
	};

	return (
		<div className="-mx-[54px] flex flex-1 flex-col">
			<BlockNoteView
				editor={editor}
				theme={resolveTheme(theme)}
				onChange={handleEditorChange}
				className="task-sheet-editor flex-1"
			/>
		</div>
	);
};
