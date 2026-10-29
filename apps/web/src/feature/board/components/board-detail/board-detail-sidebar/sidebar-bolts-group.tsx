import {
	BOLT_STATUS,
	type Bolt,
	type BoltStatus,
} from "@scrum-board/shared/schemas";
import { cva } from "class-variance-authority";
import { CheckCircle2, ChevronRight, Clock, Plus, Zap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BoltFormDialog } from "./bolt-form-dialog";
import { BoltItemActions } from "./bolt-item-actions";

const boltStatusBadgeVariants = cva(
	"px-1.5 py-0 text-[9px] font-semibold uppercase tracking-wider",
	{
		variants: {
			status: {
				ACTIVE:
					"border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
				PLANNED: "border-border bg-muted text-muted-foreground",
				COMPLETED:
					"border-primary/25 bg-primary/10 text-primary dark:text-primary",
			},
		},
		defaultVariants: {
			status: "PLANNED",
		},
	},
);

const BoltStatusIcon = ({ status }: { status: BoltStatus }) => {
	if (status === BOLT_STATUS.ACTIVE) {
		return <Zap className="size-3.5 text-emerald-500 shrink-0" />;
	}
	if (status === BOLT_STATUS.COMPLETED) {
		return <CheckCircle2 className="size-3.5 text-primary shrink-0" />;
	}
	return <Clock className="size-3.5 text-muted-foreground shrink-0" />;
};

type SidebarBoltsGroupProps = {
	boardId?: string;
	bolts: Bolt[];
	selectedBoltId: string;
	onToggleBolt: (boltId: string) => void;
};

export const SidebarBoltsGroup = ({
	boardId,
	bolts,
	selectedBoltId,
	onToggleBolt,
}: SidebarBoltsGroupProps) => {
	const [isOpen, setIsOpen] = useState(true);
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	return (
		<>
			<Collapsible
				open={isOpen}
				onOpenChange={setIsOpen}
				className="group/collapsible"
			>
				<SidebarGroup className="py-1">
					<SidebarGroupLabel className="flex w-full items-center justify-between pr-1">
						<CollapsibleTrigger className="flex flex-1 items-center gap-1.5 text-left cursor-pointer">
							<Zap className="size-3.5 text-amber-500" />
							<span>Bolts (Iterations)</span>
							<ChevronRight
								className={cn(
									"ml-auto size-3.5 transition-transform",
									isOpen && "rotate-90",
								)}
							/>
						</CollapsibleTrigger>
						{boardId && (
							<Button
								type="button"
								variant="ghost"
								size="icon-xs"
								onClick={() => setIsCreateOpen(true)}
								title="Create Bolt"
								aria-label="Create Bolt"
								className="ml-1 size-5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
							>
								<Plus className="size-3.5" />
							</Button>
						)}
					</SidebarGroupLabel>
					<CollapsibleContent>
						<SidebarGroupContent>
							<SidebarMenu>
								{bolts.map((bolt) => {
									const isSelected = selectedBoltId === bolt.id;
									return (
										<SidebarMenuItem key={bolt.id}>
											<SidebarMenuButton
												isActive={isSelected}
												onClick={() => onToggleBolt(bolt.id)}
												tooltip={bolt.goal ?? bolt.name}
												className="cursor-pointer"
											>
												<BoltStatusIcon status={bolt.status} />
												<span className="truncate text-xs">{bolt.name}</span>
												<Badge
													variant="outline"
													className={cn(
														"ml-auto shrink-0",
														boltStatusBadgeVariants({ status: bolt.status }),
													)}
												>
													{bolt.status}
												</Badge>
											</SidebarMenuButton>
											{boardId && (
												<BoltItemActions
													boardId={boardId}
													bolt={bolt}
													isSelected={isSelected}
													onClearSelection={() => onToggleBolt(bolt.id)}
												/>
											)}
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</CollapsibleContent>
				</SidebarGroup>
			</Collapsible>

			{boardId && isCreateOpen && (
				<BoltFormDialog
					open={isCreateOpen}
					onOpenChange={setIsCreateOpen}
					boardId={boardId}
				/>
			)}
		</>
	);
};
