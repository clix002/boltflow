import { PrismaPg } from "@prisma/adapter-pg";
import type { PaginateOptions } from "@scrum-board/shared/schemas";
import { Pool } from "pg";
import { env } from "@/config/env";
import {
	type PaginatedResult,
	type PaginateQuery,
	paginate,
} from "@/lib/pagination/paginate";
import {
	type Board,
	type Prisma,
	PrismaClient,
} from "../prisma/generated/client";
import { MODELS } from "./paginations";

const pool = new Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const basePrisma = new PrismaClient({ adapter });

type ModelNames = (typeof MODELS)[number];

type BoardWhere = Prisma.BoardWhereInput;
type BoardOrderBy =
	| Prisma.BoardOrderByWithRelationInput
	| Prisma.BoardOrderByWithRelationInput[];

type BoardPaginator = {
	paginate(args?: PaginateQuery<BoardWhere, BoardOrderBy>): {
		withPages(opts?: PaginateOptions): Promise<PaginatedResult<Board>>;
	};
};

type ModelPaginators = Record<ModelNames, BoardPaginator>;

const paginationFeature = Object.fromEntries(
	MODELS.map((name) => [
		name,
		{
			paginate(args?: PaginateQuery<BoardWhere, BoardOrderBy>) {
				return {
					withPages: (opts?: PaginateOptions) =>
						paginate<Board, BoardWhere, BoardOrderBy>(
							basePrisma[name],
							args,
							opts,
						),
				};
			},
		} satisfies BoardPaginator,
	]),
) as ModelPaginators;

export const prisma = basePrisma.$extends({
	model: paginationFeature,
});
