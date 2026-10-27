import type {
	PaginateInfo,
	PaginateOptions,
} from "@scrum-board/shared/schemas";
import { clamp, isNil } from "es-toolkit";

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

export const MAX_PAGE = 100_000;
export const MAX_LIMIT = 100;
export const DEFAULT_LIMIT = 17;

export function parsePage(val: unknown): number {
	if (isNil(val) || val === "") {
		return 1;
	}
	const num = Number(val);
	if (!Number.isFinite(num)) {
		return 1;
	}
	return clamp(Math.floor(num), 1, MAX_PAGE);
}

export function parseLimit(val: unknown, fallback = DEFAULT_LIMIT): number {
	if (isNil(val) || val === "") {
		return fallback;
	}
	const num = Number(val);
	if (!Number.isFinite(num)) {
		return fallback;
	}
	return clamp(Math.floor(num), 1, MAX_LIMIT);
}

export async function paginate<TDoc, TWhere, TOrderBy>(
	model: PaginatableModel<TDoc, TWhere, TOrderBy>,
	query?: PaginateQuery<TWhere, TOrderBy>,
	opts?: PaginateOptions,
): Promise<PaginatedResult<TDoc>> {
	const page = parsePage(opts?.page);
	const limit = parseLimit(opts?.limit);
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
