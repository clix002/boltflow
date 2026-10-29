import { trimToNull } from "@scrum-board/shared/schemas";
import { isEmpty } from "es-toolkit/compat";
import type { Prisma } from "@/db/prisma/generated/client";

export type TaskFilterParams = {
	search?: string;
	assigneeIds?: string[];
	boltId?: string;
	branchName?: string;
};

export function buildTaskWhere(
	params: TaskFilterParams,
): Prisma.TaskWhereInput {
	const search = trimToNull(params.search);
	const boltId = trimToNull(params.boltId);
	const branchName = trimToNull(params.branchName);
	const hasAssignees = !isEmpty(params.assigneeIds);

	const searchCondition = search
		? ({
				OR: [
					{ title: { contains: search, mode: "insensitive" } },
					{ description: { contains: search, mode: "insensitive" } },
					{ branchName: { contains: search, mode: "insensitive" } },
				],
			} satisfies Prisma.TaskWhereInput)
		: undefined;

	const assigneeCondition = hasAssignees
		? ({
				assignees: {
					some: {
						id: { in: params.assigneeIds },
					},
				},
			} satisfies Prisma.TaskWhereInput)
		: undefined;

	const boltCondition = boltId
		? ({
				boltId,
			} satisfies Prisma.TaskWhereInput)
		: undefined;

	const branchCondition = branchName
		? ({
				branchName,
			} satisfies Prisma.TaskWhereInput)
		: undefined;

	return {
		...searchCondition,
		...assigneeCondition,
		...boltCondition,
		...branchCondition,
	};
}
