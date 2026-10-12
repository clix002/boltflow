import type { PaginateOptions } from "@scrum-board/shared/schemas";
import { prisma } from "@/db/connections";
import type { Prisma } from "@/db/prisma/generated/client";
export const boardRepository = {
	findPaginatedByUserId(userId: string, opts: PaginateOptions) {
		const { search, ...optionsPage } = opts;
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
	findById(id: string) {
		return prisma.board.findUnique({
			where: { id },
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
