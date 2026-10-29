import type { Unit } from "@scrum-board/shared/schemas";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "@/components/ui/sidebar";
import { useDeleteUnitMutation } from "@/feature/board/api/use-delete-unit";
import { useConfirm } from "@/hooks/confirm-provider";
import { UnitFormDialog } from "./unit-form-dialog";

type UnitItemActionsProps = {
	boardId: string;
	unit: Unit;
	isSelected: boolean;
	onClearSelection: () => void;
};

export const UnitItemActions = ({
	boardId,
	unit,
	isSelected,
	onClearSelection,
}: UnitItemActionsProps) => {
	const [isEditOpen, setIsEditOpen] = useState(false);
	const confirm = useConfirm();
	const { mutate: deleteUnit, isPending: isDeleting } = useDeleteUnitMutation();

	const handleDelete = async () => {
		const ok = await confirm({
			title: "Delete Unit of Work",
			message: `Are you sure you want to delete "${unit.name}"? Tasks assigned to this Unit will remain on the board.`,
			confirmText: "Delete",
		});
		if (!ok) return;

		deleteUnit(
			{ boardId, unitId: unit.id },
			{
				onSuccess: () => {
					if (isSelected) {
						onClearSelection();
					}
				},
			},
		);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuAction
						showOnHover
						className="cursor-pointer"
						aria-label={`Actions for ${unit.name}`}
					>
						<MoreHorizontal className="size-3.5" />
					</SidebarMenuAction>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="right" align="start" className="w-40">
					<DropdownMenuItem
						onClick={() => setIsEditOpen(true)}
						className="cursor-pointer gap-2 text-xs"
					>
						<Pencil className="size-3.5" />
						Edit Unit
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						disabled={isDeleting}
						onClick={handleDelete}
						className="cursor-pointer gap-2 text-xs"
					>
						<Trash2 className="size-3.5" />
						Delete Unit
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{isEditOpen && (
				<UnitFormDialog
					key={unit.id}
					open={isEditOpen}
					onOpenChange={setIsEditOpen}
					boardId={boardId}
					unit={unit}
				/>
			)}
		</>
	);
};
