import type { PaginateOptions } from "@scrum-board/shared/schemas";
import { prisma } from "@/db/connections";
import type { Prisma } from "@/db/prisma/generated/client";
import {
	buildTaskWhere,
	type TaskFilterParams,
} from "@/modules/task/task.filters";

type findPaginatedByUserIdOptions = {
	userId: string;
	options: PaginateOptions;
};

type findByIdOptions = {
	id?: string;
	filters?: TaskFilterParams;
};
export const boardRepository = {
	findPaginatedByUserId({ userId, options }: findPaginatedByUserIdOptions) {
		const { search, ...optionsPage } = options;
		return prisma.board
			.paginate({
				where: search
					? {
							ownerId: userId,
							name: {
								contains: search,
								mode: "insensitive",
							},
						}
					: { ownerId: userId },
				orderBy: {
					createdAt: "desc",
				},
			})
			.withPages(optionsPage);
	},
	findById({ id, filters = {} }: findByIdOptions) {
		return prisma.board.findUnique({
			where: { id },
			include: {
				units: {
					orderBy: { createdAt: "asc" },
				},
				bolts: {
					orderBy: { createdAt: "asc" },
				},
				columns: {
					orderBy: { order: "asc" },
					include: {
						tasks: {
							where: buildTaskWhere(filters),
							orderBy: { order: "asc" },
							include: {
								assignees: {
									select: {
										id: true,
										name: true,
										avatarUrl: true,
									},
								},
								unit: {
									select: {
										id: true,
										name: true,
										color: true,
									},
								},
								bolt: {
									select: {
										id: true,
										name: true,
										status: true,
									},
								},
							},
						},
					},
				},
			},
		});
	},
	create(data: Prisma.BoardCreateInput) {
		return prisma.board.create({
			data,
		});
	},
	update(id: string, data: Prisma.BoardUpdateInput) {
		return prisma.board.update({
			where: { id },
			data,
		});
	},
	delete(id: string) {
		return prisma.board.delete({
			where: { id },
		});
	},
};
