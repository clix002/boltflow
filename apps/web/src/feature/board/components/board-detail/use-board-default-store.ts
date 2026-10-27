import { omit } from "es-toolkit";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type BoardDefault, BoardDefaultSchema } from "./board-view.schema";

const STORAGE_KEY = "sb:board-defaults:v1";

type BoardDefaultStoreState = {
	defaultsByBoard: Record<string, BoardDefault>;
	interactedBoardId: string | null;
	setDefault: (boardId: string, prefs: BoardDefault) => void;
	removeDefault: (boardId: string) => void;
	setInteractedBoard: (boardId: string | null) => void;
};

export const useBoardDefaultStore = create<BoardDefaultStoreState>()(
	persist(
		(set) => ({
			defaultsByBoard: {},
			interactedBoardId: null,

			setDefault: (boardId, prefs) =>
				set((state) => ({
					defaultsByBoard: {
						...state.defaultsByBoard,
						[boardId]: BoardDefaultSchema.parse(prefs),
					},
				})),

			removeDefault: (boardId) => {
				set((state) => ({
					defaultsByBoard: omit(state.defaultsByBoard, [boardId]),
				}));
			},

			setInteractedBoard: (boardId) => set({ interactedBoardId: boardId }),
		}),
		{
			name: STORAGE_KEY,
			version: 1,
			partialize: (state) => ({
				defaultsByBoard: state.defaultsByBoard,
			}),
		},
	),
);

export const selectBoardDefault = (
	state: BoardDefaultStoreState,
	boardId?: string,
): BoardDefault | null => {
	if (!boardId) return null;
	return state.defaultsByBoard[boardId] ?? null;
};
