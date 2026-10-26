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
});
