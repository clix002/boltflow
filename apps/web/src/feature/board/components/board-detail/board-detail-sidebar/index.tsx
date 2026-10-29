import { useState } from "react";
import { useParams } from "react-router";
import { SidebarSeparator } from "@/components/ui/sidebar";
import { useGetBoardQuery } from "@/feature/board/api/use-get-board";
import { useGetBoardGitHubQuery } from "@/feature/board/api/use-get-board-github";
import { UpdateBoardDialog } from "@/feature/board/components/form/update-board-dialog";
import { resolveActiveUnit } from "../dnd.utils";
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
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const {
		selectedUnitId,
		selectedBoltId,
		selectedBranchName,
		selectUnit,
		clearSelectedUnit,
		toggleBolt,
		toggleBranch,
	} = useBoardPreferences();

	const units = board?.units ?? [];
	const activeUnit = resolveActiveUnit(units, selectedUnitId);
	const bolts = activeUnit?.bolts ?? [];
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
				onConfigure={board ? () => setIsSettingsOpen(true) : undefined}
			/>

			{board && isSettingsOpen && (
				<UpdateBoardDialog
					key={board.updatedAt}
					open={isSettingsOpen}
					onOpenChange={setIsSettingsOpen}
					board={board}
				/>
			)}

			<SidebarUnitsGroup
				boardId={boardId}
				units={units}
				selectedUnitId={activeUnit?.id ?? ""}
				onSelectUnit={selectUnit}
				onClearSelectedUnit={clearSelectedUnit}
			/>

			<SidebarSeparator className="my-1" />

			<SidebarBoltsGroup
				boardId={boardId}
				unitId={activeUnit?.id}
				bolts={bolts}
				selectedBoltId={selectedBoltId}
				onToggleBolt={toggleBolt}
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
