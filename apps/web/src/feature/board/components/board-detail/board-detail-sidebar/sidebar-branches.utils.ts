import type { GitHubBranch, UnitWithBoard } from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";

export type BranchUnitMeta = {
	unitId: string;
	unitName: string;
};

export type BranchLeafNode = {
	branch: GitHubBranch;
	displayName: string;
	unitMeta: Maybe<BranchUnitMeta>;
	taskSubBranches: GitHubBranch[];
};

export type BranchPrefixGroup = {
	prefix: string;
	branches: BranchLeafNode[];
};

export type BranchTree = {
	defaultBranch: Maybe<GitHubBranch>;
	otherRootBranches: GitHubBranch[];
	prefixGroups: BranchPrefixGroup[];
};

const collectUnitBranchMaps = (units: UnitWithBoard[]) => {
	const unitByBranch = new Map<string, BranchUnitMeta>();
	const taskBranchesByUnitBranch = new Map<string, Set<string>>();
	const childTaskBranchSet = new Set<string>();

	for (const unit of units) {
		if (!unit.branchName) {
			continue;
		}
		unitByBranch.set(unit.branchName, {
			unitId: unit.id,
			unitName: unit.name,
		});
	}

	for (const unit of units) {
		if (!unit.branchName) {
			continue;
		}
		const cols = unit.columns ?? [];
		for (const col of cols) {
			for (const task of col.tasks) {
				const taskBranch = task.branchName;
				if (
					taskBranch &&
					taskBranch !== unit.branchName &&
					taskBranch.includes("/") &&
					!unitByBranch.has(taskBranch)
				) {
					const existing =
						taskBranchesByUnitBranch.get(unit.branchName) ?? new Set<string>();
					existing.add(taskBranch);
					taskBranchesByUnitBranch.set(unit.branchName, existing);
					childTaskBranchSet.add(taskBranch);
				}
			}
		}
	}

	return { unitByBranch, taskBranchesByUnitBranch, childTaskBranchSet };
};

export const buildBranchTree = (
	branches: GitHubBranch[],
	units: UnitWithBoard[],
): BranchTree => {
	const { unitByBranch, taskBranchesByUnitBranch, childTaskBranchSet } =
		collectUnitBranchMaps(units);

	const branchByName = new Map<string, GitHubBranch>();
	for (const branch of branches) {
		branchByName.set(branch.name, branch);
	}

	let defaultBranch: Maybe<GitHubBranch> = null;
	const otherRootBranches: GitHubBranch[] = [];
	const groupedMap = new Map<string, BranchLeafNode[]>();

	for (const branch of branches) {
		if (childTaskBranchSet.has(branch.name) && !branch.isDefault) {
			continue;
		}

		if (branch.isDefault) {
			defaultBranch = branch;
			continue;
		}

		const slashIndex = branch.name.indexOf("/");
		if (slashIndex === -1) {
			otherRootBranches.push(branch);
			continue;
		}

		const prefix = branch.name.slice(0, slashIndex);
		const shortName = branch.name.slice(slashIndex + 1);
		const taskBranchNames = taskBranchesByUnitBranch.get(branch.name);
		const taskSubBranches: GitHubBranch[] = [];

		if (taskBranchNames) {
			for (const taskBranchName of taskBranchNames) {
				const found = branchByName.get(taskBranchName);
				if (found) {
					taskSubBranches.push(found);
				}
			}
		}

		const leafNode: BranchLeafNode = {
			branch,
			displayName: shortName || branch.name,
			unitMeta: unitByBranch.get(branch.name) ?? null,
			taskSubBranches,
		};

		const group = groupedMap.get(prefix) ?? [];
		group.push(leafNode);
		groupedMap.set(prefix, group);
	}

	const prefixGroups: BranchPrefixGroup[] = Array.from(
		groupedMap.entries(),
	).map(([prefix, groupBranches]) => ({
		prefix,
		branches: groupBranches,
	}));

	return {
		defaultBranch,
		otherRootBranches,
		prefixGroups,
	};
};
