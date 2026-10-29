import type { GitHubBranch, UnitWithBoard } from "@scrum-board/shared/schemas";
import {
	ChevronRight,
	FolderGit2,
	GitBranch,
	GitCommitHorizontal,
	ShieldCheck,
} from "lucide-react";
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
import {
	type BranchLeafNode,
	type BranchPrefixGroup,
	buildBranchTree,
} from "./sidebar-branches.utils";

type SidebarBranchesGroupProps = {
	branches: GitHubBranch[];
	units: UnitWithBoard[];
	isLoading: boolean;
	selectedBranchName: string;
	onToggleBranch: (branchName: string) => void;
};

type PrefixGroupItemProps = {
	group: BranchPrefixGroup;
	selectedBranchName: string;
	onToggleBranch: (branchName: string) => void;
};

const BranchLeafItem = ({
	node,
	selectedBranchName,
	onToggleBranch,
}: {
	node: BranchLeafNode;
	selectedBranchName: string;
	onToggleBranch: (branchName: string) => void;
}) => {
	const { branch, displayName, unitMeta, taskSubBranches } = node;
	const isSelected = selectedBranchName === branch.name;

	return (
		<div className="flex flex-col">
			<SidebarMenuItem>
				<SidebarMenuButton
					isActive={isSelected}
					onClick={() => onToggleBranch(branch.name)}
					tooltip={
						unitMeta
							? `${branch.name} • Unit: ${unitMeta.unitName} (${branch.sha.slice(0, 7)})`
							: `${branch.name} (${branch.sha.slice(0, 7)})`
					}
					className="h-7 px-2 cursor-pointer"
				>
					<GitCommitHorizontal className="size-3.5 text-emerald-500 shrink-0" />
					<span className="truncate font-mono text-[11px]">{displayName}</span>
					{branch.protected && (
						<div className="ml-auto flex items-center gap-1 shrink-0">
							<span title="Protected branch">
								<ShieldCheck className="size-3 text-amber-500" />
							</span>
						</div>
					)}
				</SidebarMenuButton>
			</SidebarMenuItem>

			{taskSubBranches.length > 0 && (
				<div className="ml-3.5 border-l border-sidebar-border/70 pl-2 flex flex-col gap-0.5 my-0.5">
					{taskSubBranches.map((subBranch) => {
						const isSubSelected = selectedBranchName === subBranch.name;
						return (
							<SidebarMenuItem key={subBranch.name}>
								<SidebarMenuButton
									isActive={isSubSelected}
									onClick={() => onToggleBranch(subBranch.name)}
									tooltip={`Task Sub-branch: ${subBranch.name} (${subBranch.sha.slice(0, 7)})`}
									className="h-6 px-2 cursor-pointer"
								>
									<GitBranch className="size-3 text-indigo-400 shrink-0" />
									<span className="truncate font-mono text-[10px] text-sidebar-foreground/85">
										{subBranch.name}
									</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</div>
			)}
		</div>
	);
};

const PrefixGroupItem = ({
	group,
	selectedBranchName,
	onToggleBranch,
}: PrefixGroupItemProps) => {
	const [isGroupOpen, setIsGroupOpen] = useState(true);

	return (
		<Collapsible open={isGroupOpen} onOpenChange={setIsGroupOpen}>
			<CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-[11px] font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer">
				<ChevronRight
					className={cn(
						"size-3 text-muted-foreground transition-transform shrink-0",
						isGroupOpen && "rotate-90",
					)}
				/>
				<FolderGit2 className="size-3.5 text-emerald-500/80 shrink-0" />
				<span className="truncate font-mono">{group.prefix}/</span>
				<Badge
					variant="secondary"
					className="ml-auto h-4 px-1 text-[9px] font-normal"
				>
					{group.branches.length}
				</Badge>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="ml-3.5 border-l border-sidebar-border/70 pl-2 mt-0.5 flex flex-col gap-0.5">
					{group.branches.map((node) => (
						<BranchLeafItem
							key={node.branch.name}
							node={node}
							selectedBranchName={selectedBranchName}
							onToggleBranch={onToggleBranch}
						/>
					))}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};

export const SidebarBranchesGroup = ({
	branches,
	units,
	isLoading,
	selectedBranchName,
	onToggleBranch,
}: SidebarBranchesGroupProps) => {
	const [isOpen, setIsOpen] = useState(true);
	const { defaultBranch, otherRootBranches, prefixGroups } = buildBranchTree(
		branches,
		units,
	);

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="group/collapsible"
		>
			<SidebarGroup className="py-1">
				<SidebarGroupLabel asChild>
					<CollapsibleTrigger className="flex w-full items-center gap-1.5 cursor-pointer">
						<GitBranch className="size-3.5 text-emerald-500" />
						<span>GitHub Branches</span>
						<Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
							{branches.length}
						</Badge>
						<ChevronRight
							className={cn(
								"ml-auto size-3.5 transition-transform",
								isOpen && "rotate-90",
							)}
						/>
					</CollapsibleTrigger>
				</SidebarGroupLabel>
				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{isLoading && (
								<SidebarMenuItem>
									<div className="px-2 py-1.5 text-xs text-muted-foreground">
										Syncing branches from GitHub...
									</div>
								</SidebarMenuItem>
							)}
							{!isLoading && branches.length === 0 && (
								<SidebarMenuItem>
									<div className="px-2 py-1.5 text-xs text-muted-foreground">
										No remote branches found
									</div>
								</SidebarMenuItem>
							)}

							{defaultBranch && (
								<div className="flex flex-col">
									<SidebarMenuItem>
										<SidebarMenuButton
											isActive={selectedBranchName === defaultBranch.name}
											onClick={() => onToggleBranch(defaultBranch.name)}
											tooltip={`Default branch • SHA: ${defaultBranch.sha.slice(0, 7)}`}
											className="cursor-pointer font-medium"
										>
											<GitBranch className="size-3.5 text-emerald-500 shrink-0" />
											<span className="truncate font-mono text-xs">
												{defaultBranch.name}
											</span>
											<div className="ml-auto flex items-center gap-1 shrink-0">
												{defaultBranch.protected && (
													<span title="Protected branch">
														<ShieldCheck className="size-3 text-amber-500" />
													</span>
												)}
												<Badge
													variant="secondary"
													className="h-4 px-1 text-[9px]"
												>
													default
												</Badge>
											</div>
										</SidebarMenuButton>
									</SidebarMenuItem>

									{prefixGroups.length > 0 && (
										<div className="ml-3.5 border-l border-sidebar-border/80 pl-2 mt-0.5 mb-1 flex flex-col gap-0.5">
											{prefixGroups.map((group) => (
												<PrefixGroupItem
													key={group.prefix}
													group={group}
													selectedBranchName={selectedBranchName}
													onToggleBranch={onToggleBranch}
												/>
											))}
										</div>
									)}
								</div>
							)}

							{!defaultBranch &&
								prefixGroups.map((group) => (
									<PrefixGroupItem
										key={group.prefix}
										group={group}
										selectedBranchName={selectedBranchName}
										onToggleBranch={onToggleBranch}
									/>
								))}

							{otherRootBranches.map((branch) => {
								const isSelected = selectedBranchName === branch.name;
								return (
									<SidebarMenuItem key={branch.name}>
										<SidebarMenuButton
											isActive={isSelected}
											onClick={() => onToggleBranch(branch.name)}
											tooltip={`Root branch • SHA: ${branch.sha.slice(0, 7)}`}
											className="cursor-pointer"
										>
											<GitBranch className="size-3.5 text-muted-foreground shrink-0" />
											<span className="truncate font-mono text-xs">
												{branch.name}
											</span>
											{branch.protected && (
												<div className="ml-auto flex items-center shrink-0">
													<span title="Protected branch">
														<ShieldCheck className="size-3 text-amber-500" />
													</span>
												</div>
											)}
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
