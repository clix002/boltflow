import type { Bolt, BoltStatus } from "@scrum-board/shared/schemas";
import { cva } from "class-variance-authority";
import { CheckCircle2, ChevronRight, Clock, Zap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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

const BOLT_STATUS = {
	ACTIVE: "ACTIVE",
	PLANNED: "PLANNED",
	COMPLETED: "COMPLETED",
} as const satisfies Record<BoltStatus, BoltStatus>;

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
	bolts: Bolt[];
	selectedBoltId: string;
	onToggleBolt: (boltId: string) => void;
};

export const SidebarBoltsGroup = ({
	bolts,
	selectedBoltId,
	onToggleBolt,
}: SidebarBoltsGroupProps) => {
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
							<Zap className="size-3.5 text-amber-500" />
							Bolts (Iterations)
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
