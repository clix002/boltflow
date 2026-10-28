import { describe, expect, it } from "bun:test";
import { getMoveShiftOperations } from "../task.reorder";

describe("getMoveShiftOperations", () => {
	it("returns empty operations when position does not change within same column", () => {
		const ops = getMoveShiftOperations({
			sourceColumnId: "c1",
			sourceOrder: 2,
			targetColumnId: "c1",
			targetOrder: 2,
		});

		expect(ops).toEqual([]);
	});

	it("shifts intermediate items down (-1) when moving item down within same column", () => {
		const ops = getMoveShiftOperations({
			sourceColumnId: "c1",
			sourceOrder: 1,
			targetColumnId: "c1",
			targetOrder: 3,
		});

		expect(ops).toHaveLength(1);
		expect(ops[0]).toEqual({
			where: {
				columnId: "c1",
				order: { gt: 1, lte: 3 },
			},
			data: { order: { decrement: 1 } },
		});
	});

	it("shifts intermediate items up (+1) when moving item up within same column", () => {
		const ops = getMoveShiftOperations({
			sourceColumnId: "c1",
			sourceOrder: 3,
			targetColumnId: "c1",
			targetOrder: 1,
		});

		expect(ops).toHaveLength(1);
		expect(ops[0]).toEqual({
			where: {
				columnId: "c1",
				order: { gte: 1, lt: 3 },
			},
			data: { order: { increment: 1 } },
		});
	});

	it("shifts source column items down (-1) and target column items up (+1) when moving across columns", () => {
		const ops = getMoveShiftOperations({
			sourceColumnId: "c1",
			sourceOrder: 2,
			targetColumnId: "c2",
			targetOrder: 1,
		});

		expect(ops).toHaveLength(2);
		expect(ops[0]).toEqual({
			where: {
				columnId: "c1",
				order: { gt: 2 },
			},
			data: { order: { decrement: 1 } },
		});
		expect(ops[1]).toEqual({
			where: {
				columnId: "c2",
				order: { gte: 1 },
			},
			data: { order: { increment: 1 } },
		});
	});
});
