import type { BoardSchema } from "@scrum-board/shared/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { range } from "es-toolkit";
import { useDeferredValue, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { UseDeleteBoardMutation } from "@/feature/board/api/use-detete-board";
import { useGetBoardsQuery } from "@/feature/board/api/use-get-boards";
import { BoardCard } from "@/feature/board/components/atomic/board-card";
import { BoardsEmpty } from "@/feature/board/components/atomic/boards-empty";
import { CreateBoardCard } from "@/feature/board/components/atomic/create-biard-card";
import { CreateBoardDialog } from "@/feature/board/components/form/create-board-dialog";
import { UpdateBoardDialog } from "@/feature/board/components/form/update-board-dialog";
import { useConfirm } from "@/hooks/confirm-provider";
import { isEmpty } from "@/lib/utils";

type Board = z.infer<typeof BoardSchema>;

export const BoardList = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [searchParams, setSearchParams] = useSearchParams();
	const search = searchParams.get("q") ?? "";
	const page = Number(searchParams.get("page")) || 1;
	const deferredSearch = useDeferredValue(search);

	const confirm = useConfirm();
	const [open, setOpen] = useState(false);
	const [editingBoard, setEditingBoard] = useState<Board | null>(null);
	const { data, isPending, isError, refetch } = useGetBoardsQuery({
		page,
		search: deferredSearch,
	});
	const { mutate: deleteBoard } = UseDeleteBoardMutation();

	const handleEditBoard = (board: Board) => () => {
		setEditingBoard(board);
	};

	const handleDeleteBoard = (id: string) => async () => {
		const ok = await confirm({
			title: "Delete board?",
			message: "This cannot be undone.",
			confirmText: "Delete",
		});
		if (!ok) return;
		deleteBoard(
			{ id },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["boards"] });
				},
			},
		);
	};
	const handleCreateBoard = () => {
		setOpen(true);
	};

	const handleEditOpenChange = (o: boolean) => {
		if (!o) setEditingBoard(null);
	};

	const goToPage = (newPage: number) => {
		setSearchParams((prev) => {
			prev.set("page", String(newPage));
			return prev;
		});
	};

	const handleOpenBoard = (id: string) => () => {
		navigate(`/board/${id}`);
	};

	if (isPending) {
		return (
			<div className="grid gap-x-8 gap-y-6 md:grid-cols-3">
				{range(6).map((i) => (
					<BoardCard.Skeleton key={i} />
				))}
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-4 min-h-100">
				<p>Something went wrong loading boards.</p>
				<Button onClick={() => refetch()}>Retry</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col">
			<CreateBoardDialog open={open} onOpenChange={setOpen} />
			<div className="grid flex-1 content-start gap-x-8 gap-y-6 md:grid-cols-3">
				<CreateBoardCard onclick={handleCreateBoard} />
				{isEmpty(data?.docs) && <BoardsEmpty onCreate={handleCreateBoard} />}
				{data?.docs.map((board) => (
					<BoardCard
						onOpen={handleOpenBoard(board.id)}
						board={board}
						key={board.id}
						onEdit={handleEditBoard(board)}
						onDelete={handleDeleteBoard(board.id)}
					/>
				))}
			</div>
			{data && data.info.totalPages > 1 && (
				<Pagination className="mt-auto h-20">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => goToPage(page - 1)}
								aria-disabled={!data.info.hasPrevPage}
								className={
									!data.info.hasPrevPage
										? "pointer-events-none opacity-50"
										: "cursor-pointer"
								}
							/>
						</PaginationItem>

						<PaginationItem>
							<span className="px-4 text-sm text-muted-foreground">
								Page {data.info.page} of {data.info.totalPages} ·{" "}
								{data.info.totalDocs} boards
							</span>
						</PaginationItem>

						<PaginationItem>
							<PaginationNext
								onClick={() => goToPage(page + 1)}
								aria-disabled={!data.info.hasNextPage}
								className={
									!data.info.hasNextPage
										? "pointer-events-none opacity-50"
										: "cursor-pointer"
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
			{editingBoard && (
				<UpdateBoardDialog
					board={editingBoard}
					open={!!editingBoard}
					onOpenChange={handleEditOpenChange}
				/>
			)}
		</div>
	);
};
