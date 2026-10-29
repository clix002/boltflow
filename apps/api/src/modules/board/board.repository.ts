import { BOLT_STATUS, type PaginateOptions } from "@scrum-board/shared/schemas";
import { prisma } from "@/db/connections";
import type { Prisma } from "@/db/prisma/generated/client";
import {
	buildTaskWhere,
	type TaskFilterParams,
} from "@/modules/task/task.filters";

export const DEFAULT_UNIT_COLUMNS = [
	{ name: "1. Elaboration (Spec)", order: 0 },
	{ name: "2. Ready for Bolt", order: 1 },
	{ name: "3. Constructing", order: 2 },
	{ name: "4. PR Review", order: 3 },
	{ name: "5. Merged", order: 4 },
] as const;

type findPaginatedByUserIdOptions = {
	userId: string;
	options: PaginateOptions;
};

type findByIdOptions = {
	id?: string;
	filters?: TaskFilterParams;
};

export const boardRepository = {
	async findPaginatedByUserId({
		userId,
		options,
	}: findPaginatedByUserIdOptions) {
		const { search, ...optionsPage } = options;
		const paginated = await prisma.board
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

		if (paginated.docs.length === 0) {
			return paginated;
		}

		const boardIds = paginated.docs.map((board) => board.id);
		const units = await prisma.unit.findMany({
			where: { boardId: { in: boardIds } },
			select: {
				boardId: true,
				_count: {
					select: {
						bolts: {
							where: { status: BOLT_STATUS.ACTIVE },
						},
					},
				},
			},
		});

		const docsWithCounts = paginated.docs.map((board) => {
			let unitCount = 0;
			let activeBoltCount = 0;
			for (const unit of units) {
				if (unit.boardId === board.id) {
					unitCount += 1;
					activeBoltCount += unit._count.bolts;
				}
			}
			return {
				...board,
				unitCount,
				activeBoltCount,
			};
		});

		return {
			docs: docsWithCounts,
			info: paginated.info,
		};
	},
	findById({ id, filters = {} }: findByIdOptions) {
		return prisma.board.findUnique({
			where: { id },
			include: {
				units: {
					orderBy: { createdAt: "asc" },
					include: {
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
				},
			},
		});
	},
	create(data: Prisma.BoardCreateInput) {
		return prisma.board.create({
			data: {
				...data,
				units: {
					create: {
						name: "Core",
						description: "Main domain unit",
						columns: {
							create: [...DEFAULT_UNIT_COLUMNS],
						},
					},
				},
			},
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
			select: { id: true },
		});
	},
	findOwnershipById(id: string) {
		return prisma.board.findUnique({
			where: { id },
			select: {
				id: true,
				ownerId: true,
				githubRepo: true,
				defaultBranch: true,
				owner: {
					select: {
						githubToken: true,
					},
				},
			},
		});
	},
	findUnitOwnershipById(id: string) {
		return prisma.unit.findUnique({
			where: { id },
			select: {
				id: true,
				boardId: true,
				board: {
					select: {
						ownerId: true,
						githubRepo: true,
						defaultBranch: true,
						owner: {
							select: {
								githubToken: true,
							},
						},
					},
				},
			},
		});
	},
	createUnit(data: Prisma.UnitUncheckedCreateInput) {
		return prisma.unit.create({
			data: {
				...data,
				columns: {
					create: [...DEFAULT_UNIT_COLUMNS],
				},
			},
		});
	},
	updateUnit(id: string, data: Prisma.UnitUpdateInput) {
		return prisma.unit.update({
			where: { id },
			data,
		});
	},
	deleteUnit(id: string) {
		return prisma.unit.delete({
			where: { id },
			select: { id: true },
		});
	},
	findBoltOwnershipById(id: string) {
		return prisma.bolt.findUnique({
			where: { id },
			select: {
				id: true,
				unitId: true,
				unit: {
					select: {
						boardId: true,
						board: {
							select: { ownerId: true },
						},
					},
				},
			},
		});
	},
	createBolt(data: Prisma.BoltUncheckedCreateInput) {
		return prisma.bolt.create({
			data,
		});
	},
	updateBolt(id: string, data: Prisma.BoltUpdateInput) {
		return prisma.bolt.update({
			where: { id },
			data,
		});
	},
	deleteBolt(id: string) {
		return prisma.bolt.delete({
			where: { id },
			select: { id: true },
		});
	},
};
