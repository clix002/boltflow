import type { GitHubBranch } from "@scrum-board/shared/schemas";
import { ChevronRight, CircleDot, GitBranch, Lock } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type SidebarBranchesGroupProps = {
	branches: GitHubBranch[];
	isLoading: boolean;
	selectedBranchName: string;
	onToggleBranch: (branchName: string) => void;
};

export const SidebarBranchesGroup = ({
	branches,
	isLoading,
	selectedBranchName,
	onToggleBranch,
}: SidebarBranchesGroupProps) => {
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
							<GitBranch className="size-3.5 text-emerald-500" />
							GitHub Branches
							<Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
								{branches.length}
							</Badge>
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
							{isLoading ? (
								<div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
									<Spinner className="size-3.5" />
									<span>Syncing GitHub branches...</span>
								</div>
							) : (
								branches.map((branch) => {
									const isSelected = selectedBranchName === branch.name;
									return (
										<SidebarMenuItem key={branch.name}>
											<SidebarMenuButton
												isActive={isSelected}
												onClick={() => onToggleBranch(branch.name)}
												tooltip={`SHA: ${branch.sha.slice(0, 7)}`}
												className="cursor-pointer"
											>
												<CircleDot
													className={cn(
														"size-3.5 shrink-0",
														branch.isDefault
															? "text-primary"
															: "text-emerald-500",
													)}
												/>
												<span className="truncate font-mono text-[11px]">
													{branch.name}
												</span>
												{branch.isDefault && (
													<Badge
														variant="outline"
														className="ml-auto h-4 px-1 text-[9px]"
													>
														default
													</Badge>
												)}
												{branch.protected && !branch.isDefault && (
													<Lock className="ml-auto size-3 text-muted-foreground" />
												)}
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>
	);
};
