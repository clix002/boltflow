import { isEmpty } from "es-toolkit/compat";
import type { Prisma } from "@/db/prisma/generated/client";

export type TaskFilterParams = {
	search?: string;
	assigneeIds?: string[];
	unitId?: string;
	boltId?: string;
	branchName?: string;
};

export function buildTaskWhere(
	params: TaskFilterParams,
): Prisma.TaskWhereInput {
	const search = params.search?.trim();
	const hasSearch = !isEmpty(search);
	const hasAssignees = !isEmpty(params.assigneeIds);
	const hasUnit = !isEmpty(params.unitId?.trim());
	const hasBolt = !isEmpty(params.boltId?.trim());
	const hasBranch = !isEmpty(params.branchName?.trim());

	const searchCondition =
		hasSearch &&
		({
			OR: [
				{ title: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
				{ branchName: { contains: search, mode: "insensitive" } },
			],
		} satisfies Prisma.TaskWhereInput);

	const assigneeCondition =
		hasAssignees &&
		({
			assignees: {
				some: {
					id: { in: params.assigneeIds },
				},
			},
		} satisfies Prisma.TaskWhereInput);

	const unitCondition =
		hasUnit &&
		({
			unitId: params.unitId?.trim(),
		} satisfies Prisma.TaskWhereInput);

	const boltCondition =
		hasBolt &&
		({
			boltId: params.boltId?.trim(),
		} satisfies Prisma.TaskWhereInput);

	const branchCondition =
		hasBranch &&
		({
			branchName: params.branchName?.trim(),
		} satisfies Prisma.TaskWhereInput);

	return {
		...searchCondition,
		...assigneeCondition,
		...unitCondition,
		...boltCondition,
		...branchCondition,
	};
}
