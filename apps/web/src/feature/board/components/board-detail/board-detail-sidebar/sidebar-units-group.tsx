import type { Unit } from "@scrum-board/shared/schemas";
import { ChevronRight, Layers } from "lucide-react";
import { useState } from "react";
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

type SidebarUnitsGroupProps = {
	units: Unit[];
	selectedUnitId: string;
	onToggleUnit: (unitId: string) => void;
};

export const SidebarUnitsGroup = ({
	units,
	selectedUnitId,
	onToggleUnit,
}: SidebarUnitsGroupProps) => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="group/collapsible"
		>
			<SidebarGroup className="py-1">
				<SidebarGroupLabel asChild>
					<CollapsibleTrigger className="flex w-full items-center justify-between cursor-pointer">
						<span className="flex items-center gap-1.5">
							<Layers className="size-3.5 text-indigo-500" />
							Units of Work
						</span>
						<ChevronRight
							className={cn(
								"size-3.5 transition-transform",
								isOpen && "rotate-90",
							)}
						/>
					</CollapsibleTrigger>
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
											onClick={() => onToggleUnit(unit.id)}
											tooltip={unit.description ?? unit.name}
											className="cursor-pointer"
										>
											<span
												className="size-2.5 rounded-full shrink-0"
												style={{ backgroundColor: unit.color }}
											/>
											<span className="truncate text-xs">{unit.name}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>
	);
};
