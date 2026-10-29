import { BoardList } from "./board-list";

export const Board = () => {
	return (
		<div className="flex flex-1 flex-col overflow-y-auto px-2 py-8">
			<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
				<BoardList />
			</div>
		</div>
	);
};
