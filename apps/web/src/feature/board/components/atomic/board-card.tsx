import type { BoardSchema } from "@scrum-board/shared/schemas";
import { MoreHorizontal } from "lucide-react";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

type BoardCardProps = {
	board: z.infer<typeof BoardSchema>;
	onEdit: () => void;
	onDelete: () => void;
	onOpen: () => void;
};

export const BoardCard = ({
	board,
	onEdit,
	onDelete,
	onOpen,
}: BoardCardProps) => {
	return (
		<Card onClick={onOpen}>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="truncate">{board.name}</CardTitle>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							onClick={(e) => e.stopPropagation()}
						>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
						<DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
						<DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardHeader>
			<CardFooter>
				<div className="flex flex-col justify-between text-xs text-muted-foreground">
					<span>
						Created at: {new Date(board.createdAt).toLocaleDateString()}
					</span>
					<span>
						Updated at: {new Date(board.updatedAt).toLocaleDateString()}
					</span>
				</div>
			</CardFooter>
		</Card>
	);
};

BoardCard.Skeleton = () => {
	return <Skeleton className="h-45 rounded-xl" />;
};
