import { LayoutGrid } from "lucide-react";
import { useParams } from "react-router";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { useGetBoardQuery } from "@/feature/board/api/use-get-board";
import { useGetBoardGitHubQuery } from "@/feature/board/api/use-get-board-github";
import { useBoardPreferences } from "../use-board-preferences";
import { SidebarBoltsGroup } from "./sidebar-bolts-group";
import { SidebarBranchesGroup } from "./sidebar-branches-group";
import { SidebarRepoBanner } from "./sidebar-repo-banner";
import { SidebarUnitsGroup } from "./sidebar-units-group";

export const BoardDetailSidebar = () => {
	const { boardId } = useParams<{ boardId: string }>();
	const { data: board } = useGetBoardQuery(boardId);
	const { data: githubInfo, isPending: isLoadingGitHub } =
		useGetBoardGitHubQuery(boardId);

	const {
		selectedUnitId,
		selectedBoltId,
		selectedBranchName,
		hasContextFilter,
		toggleUnit,
		toggleBolt,
		toggleBranch,
		clearContextFilters,
	} = useBoardPreferences();

	const units = board?.units ?? [];
	const bolts = board?.bolts ?? [];
	const branches = githubInfo?.branches ?? [];
	const repoSlug = githubInfo?.repo ?? board?.githubRepo ?? null;
	const defaultBranch =
		githubInfo?.defaultBranch ?? board?.defaultBranch ?? "main";

	return (
		<div className="flex flex-col gap-1 py-1">
			<SidebarRepoBanner
				repoSlug={repoSlug}
				defaultBranch={defaultBranch}
				connected={Boolean(githubInfo?.connected)}
			/>

			<SidebarGroup className="py-0">
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								isActive={!hasContextFilter}
								onClick={clearContextFilters}
								className="cursor-pointer"
							>
								<LayoutGrid className="size-4" />
								<span>All Board Tasks</span>
								{hasContextFilter && (
									<SidebarMenuBadge className="text-[10px] text-primary">
										Reset
									</SidebarMenuBadge>
								)}
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>

			<SidebarSeparator className="my-1" />

			<SidebarBoltsGroup
				boardId={boardId}
				bolts={bolts}
				selectedBoltId={selectedBoltId}
				onToggleBolt={toggleBolt}
			/>

			<SidebarSeparator className="my-1" />

			<SidebarUnitsGroup
				boardId={boardId}
				units={units}
				selectedUnitId={selectedUnitId}
				onToggleUnit={toggleUnit}
			/>

			<SidebarSeparator className="my-1" />

			<SidebarBranchesGroup
				branches={branches}
				isLoading={isLoadingGitHub}
				selectedBranchName={selectedBranchName}
				onToggleBranch={toggleBranch}
			/>
		</div>
	);
};
