import { describe, expect, it } from "bun:test";
import { type PaginatableModel, paginate } from "../paginate";

describe("paginate utility", () => {
	it("correctly calculates pagination metadata for first page", async () => {
		const mockItems = [{ id: "1" }, { id: "2" }];
		const mockModel: PaginatableModel<{ id: string }, unknown, unknown> = {
			findMany: async () => mockItems,
			count: async () => 25,
		};

		const result = await paginate(mockModel, {}, { page: 1, limit: 10 });

		expect(result.docs).toEqual(mockItems);
		expect(result.info.page).toBe(1);
		expect(result.info.limit).toBe(10);
		expect(result.info.totalDocs).toBe(25);
		expect(result.info.totalPages).toBe(3);
		expect(result.info.hasNextPage).toBe(true);
		expect(result.info.hasPrevPage).toBe(false);
		expect(result.info.nextPage).toBe(2);
		expect(result.info.prevPage).toBeUndefined();
	});

	it("correctly calculates pagination metadata for middle page", async () => {
		const mockModel: PaginatableModel<{ id: string }, unknown, unknown> = {
			findMany: async () => [{ id: "11" }],
			count: async () => 30,
		};

		const result = await paginate(mockModel, {}, { page: 2, limit: 10 });

		expect(result.info.page).toBe(2);
		expect(result.info.hasNextPage).toBe(true);
		expect(result.info.hasPrevPage).toBe(true);
		expect(result.info.nextPage).toBe(3);
		expect(result.info.prevPage).toBe(1);
	});

	it("correctly calculates pagination metadata for last page", async () => {
		const mockModel: PaginatableModel<{ id: string }, unknown, unknown> = {
			findMany: async () => [{ id: "21" }],
			count: async () => 21,
		};

		const result = await paginate(mockModel, {}, { page: 3, limit: 10 });

		expect(result.info.page).toBe(3);
		expect(result.info.hasNextPage).toBe(false);
		expect(result.info.hasPrevPage).toBe(true);
		expect(result.info.nextPage).toBeUndefined();
		expect(result.info.prevPage).toBe(2);
	});

	it("handles empty results properly", async () => {
		const mockModel: PaginatableModel<{ id: string }, unknown, unknown> = {
			findMany: async () => [],
			count: async () => 0,
		};

		const result = await paginate(mockModel);

		expect(result.docs).toEqual([]);
		expect(result.info.totalDocs).toBe(0);
		expect(result.info.totalPages).toBe(0);
		expect(result.info.hasNextPage).toBe(false);
		expect(result.info.hasPrevPage).toBe(false);
	});

	it("safely clamps non-finite or extreme page and limit values", async () => {
		let capturedArgs: { skip?: number; take?: number } = {};
		const mockModel: PaginatableModel<{ id: string }, unknown, unknown> = {
			findMany: async (args) => {
				capturedArgs = args;
				return [];
			},
			count: async () => 50,
		};

		const result = await paginate(
			mockModel,
			{},
			{ page: Number.POSITIVE_INFINITY, limit: 1000 },
		);

		expect(result.info.page).toBe(1);
		expect(result.info.limit).toBe(100);
		expect(capturedArgs.skip).toBe(0);
		expect(capturedArgs.take).toBe(100);
	});

	it("safely handles extreme finite numbers and edge-case inputs", async () => {
		const mockModel: PaginatableModel<{ id: string }, unknown, unknown> = {
			findMany: async () => [],
			count: async () => 0,
		};

		for (const page of [1e306, 1e307, Number.NaN, 0, -3]) {
			const res = await paginate(mockModel, {}, { page });
			expect(Number.isFinite(res.info.page)).toBe(true);
			expect(res.info.page).toBeGreaterThanOrEqual(1);
			expect(res.info.page).toBeLessThanOrEqual(100_000);
		}

		for (const limit of [0, Number.NaN, 1000, -1]) {
			const res = await paginate(mockModel, {}, { limit });
			expect(Number.isFinite(res.info.limit)).toBe(true);
			expect(res.info.limit).toBeGreaterThanOrEqual(1);
			expect(res.info.limit).toBeLessThanOrEqual(100);
		}

		const emptyLimit = await paginate(mockModel, {}, { limit: undefined });
		expect(emptyLimit.info.limit).toBe(17);
	});
});
