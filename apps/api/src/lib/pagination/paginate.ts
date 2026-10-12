import type {
	PaginateInfo,
	PaginateOptions,
} from "@scrum-board/shared/schemas";

export type PaginateQuery<TWhere, TOrderBy> = {
	where?: TWhere;
	orderBy?: TOrderBy;
};

export type PaginatableModel<TDoc, TWhere, TOrderBy> = {
	findMany(
		args: PaginateQuery<TWhere, TOrderBy> & { skip?: number; take?: number },
	): Promise<TDoc[]>;
	count(args: { where?: TWhere }): Promise<number>;
};

export type PaginatedResult<TDoc> = {
	docs: TDoc[];
	info: PaginateInfo;
};

export async function paginate<TDoc, TWhere, TOrderBy>(
	model: PaginatableModel<TDoc, TWhere, TOrderBy>,
	query?: PaginateQuery<TWhere, TOrderBy>,
	opts?: PaginateOptions,
): Promise<PaginatedResult<TDoc>> {
	const { page = 1, limit = 17 } = opts ?? {};
	const skip = (page - 1) * limit;

	const [docs, totalDocs] = await Promise.all([
		model.findMany({ ...query, skip, take: limit }),
		model.count({ where: query?.where }),
	]);

	const totalPages = Math.ceil(totalDocs / limit);

	return {
		docs,
		info: {
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
			limit,
			nextPage: page < totalPages ? page + 1 : undefined,
			page,
			prevPage: page > 1 ? page - 1 : undefined,
			totalDocs: Number(totalDocs),
			totalPages,
		},
	};
}
