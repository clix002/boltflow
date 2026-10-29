import type { Unit } from "@scrum-board/shared/schemas";
import { ChevronRight, GitBranch, Layers, Plus } from "lucide-react";
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
import { UnitFormDialog } from "./unit-form-dialog";
import { UnitItemActions } from "./unit-item-actions";

type SidebarUnitsGroupProps = {
	boardId?: string;
	units: Unit[];
	selectedUnitId: string;
	onSelectUnit: (unitId: string) => void;
	onClearSelectedUnit: () => void;
};

export const SidebarUnitsGroup = ({
	boardId,
	units,
	selectedUnitId,
	onSelectUnit,
	onClearSelectedUnit,
}: SidebarUnitsGroupProps) => {
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
							<Layers className="size-3.5 text-indigo-500" />
							<span>Units of Work</span>
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
								title="Create Unit of Work"
								aria-label="Create Unit of Work"
								className="ml-1 size-5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
							>
								<Plus className="size-3.5" />
							</Button>
						)}
					</SidebarGroupLabel>
					<CollapsibleContent>
						<SidebarGroupContent>
							<SidebarMenu>
								{units.map((unit) => {
									const isSelected = selectedUnitId === unit.id;
									return (
										<SidebarMenuItem key={unit.id}>
											<SidebarMenuButton
												isActive={isSelected}
												onClick={() => onSelectUnit(unit.id)}
												tooltip={
													unit.branchName
														? `${unit.name} (${unit.branchName})`
														: (unit.description ?? unit.name)
												}
												className="cursor-pointer"
											>
												<span
													className="size-2.5 rounded-full shrink-0"
													style={{ backgroundColor: unit.color }}
												/>
												<span className="truncate text-xs">{unit.name}</span>
												{unit.branchName && (
													<Badge
														variant="outline"
														className="ml-auto h-4 gap-0.5 px-1 font-mono text-[9px] text-emerald-600 dark:text-emerald-400 shrink-0 max-w-[48%]"
													>
														<GitBranch className="size-2.5 shrink-0" />
														<span className="truncate">{unit.branchName}</span>
													</Badge>
												)}
											</SidebarMenuButton>
											{boardId && (
												<UnitItemActions
													boardId={boardId}
													unit={unit}
													isSelected={isSelected}
													onClearSelection={onClearSelectedUnit}
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
				<UnitFormDialog
					open={isCreateOpen}
					onOpenChange={setIsCreateOpen}
					boardId={boardId}
				/>
			)}
		</>
	);
};
