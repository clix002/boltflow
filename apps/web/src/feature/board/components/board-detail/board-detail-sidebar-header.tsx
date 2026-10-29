import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGetBoardQuery } from "@/feature/board/api/use-get-board";

export const BoardDetailSidebarHeader = () => {
	const { boardId } = useParams();
	const { data: board, isPending } = useGetBoardQuery(boardId);

	return (
		<div className="flex items-center gap-2 w-full">
			<Button variant="ghost" size="icon" className="size-7 shrink-0" asChild>
				<Link to="/boards">
					<ArrowLeft className="size-4" />
				</Link>
			</Button>
			<h2 className="text-sm font-semibold truncate">
				{isPending ? <Spinner className="size-4 shrink-0" /> : board?.name}
			</h2>
		</div>
	);
};
