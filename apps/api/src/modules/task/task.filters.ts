import { isEmpty } from "es-toolkit/compat";
import type { Prisma } from "@/db/prisma/generated/client";

export type TaskFilterParams = {
	search?: string;
	assigneeIds?: string[];
};

export function buildTaskWhere(
	params: TaskFilterParams,
): Prisma.TaskWhereInput {
	const search = params.search?.trim();
	const hasSearch = !isEmpty(search);
	const hasAssignees = !isEmpty(params.assigneeIds);

	const searchCondition =
		hasSearch &&
		({
			OR: [
				{ title: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
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

	return {
		...searchCondition,
		...assigneeCondition,
	};
}
