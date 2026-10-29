import {
	BOLT_STATUS,
	type Bolt,
	type BoltStatus,
} from "@scrum-board/shared/schemas";
import {
	CheckCircle2,
	Clock,
	MoreHorizontal,
	Pencil,
	Trash2,
	Zap,
} from "lucide-react";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "@/components/ui/sidebar";
import { useDeleteBoltMutation } from "@/feature/board/api/use-delete-bolt";
import { useUpdateBoltMutation } from "@/feature/board/api/use-update-bolt";
import { useConfirm } from "@/hooks/confirm-provider";
import { BoltFormDialog } from "./bolt-form-dialog";

type BoltItemActionsProps = {
	boardId: string;
	bolt: Bolt;
	isSelected: boolean;
	onClearSelection: () => void;
};

export const BoltItemActions = ({
	boardId,
	bolt,
	isSelected,
	onClearSelection,
}: BoltItemActionsProps) => {
	const [isEditOpen, setIsEditOpen] = useState(false);
	const confirm = useConfirm();
	const { mutate: updateBolt, isPending: isUpdating } = useUpdateBoltMutation();
	const { mutate: deleteBolt, isPending: isDeleting } = useDeleteBoltMutation();

	const handleStatusChange = (status: BoltStatus) => {
		if (bolt.status === status) return;
		updateBolt({
			boardId,
			boltId: bolt.id,
			data: { status },
		});
	};

	const handleDelete = async () => {
		const ok = await confirm({
			title: "Delete Bolt",
			message: `Are you sure you want to delete "${bolt.name}"? Tasks assigned to this Bolt will remain on the board.`,
			confirmText: "Delete",
		});
		if (!ok) return;

		deleteBolt(
			{ boardId, boltId: bolt.id },
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
						aria-label={`Actions for ${bolt.name}`}
					>
						<MoreHorizontal className="size-3.5" />
					</SidebarMenuAction>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="right" align="start" className="w-44">
					<DropdownMenuItem
						onClick={() => setIsEditOpen(true)}
						className="cursor-pointer gap-2 text-xs"
					>
						<Pencil className="size-3.5" />
						Edit Bolt
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						disabled={isUpdating || bolt.status === BOLT_STATUS.PLANNED}
						onClick={() => handleStatusChange(BOLT_STATUS.PLANNED)}
						className="cursor-pointer gap-2 text-xs"
					>
						<Clock className="size-3.5 text-muted-foreground" />
						Set Planned
					</DropdownMenuItem>
					<DropdownMenuItem
						disabled={isUpdating || bolt.status === BOLT_STATUS.ACTIVE}
						onClick={() => handleStatusChange(BOLT_STATUS.ACTIVE)}
						className="cursor-pointer gap-2 text-xs"
					>
						<Zap className="size-3.5 text-emerald-500" />
						Set Active
					</DropdownMenuItem>
					<DropdownMenuItem
						disabled={isUpdating || bolt.status === BOLT_STATUS.COMPLETED}
						onClick={() => handleStatusChange(BOLT_STATUS.COMPLETED)}
						className="cursor-pointer gap-2 text-xs"
					>
						<CheckCircle2 className="size-3.5 text-primary" />
						Set Completed
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						disabled={isDeleting}
						onClick={handleDelete}
						className="cursor-pointer gap-2 text-xs"
					>
						<Trash2 className="size-3.5" />
						Delete Bolt
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{isEditOpen && (
				<BoltFormDialog
					key={bolt.id}
					open={isEditOpen}
					onOpenChange={setIsEditOpen}
					boardId={boardId}
					bolt={bolt}
				/>
			)}
		</>
	);
};
