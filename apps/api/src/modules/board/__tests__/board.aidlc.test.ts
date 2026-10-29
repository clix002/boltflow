import { describe, expect, it, spyOn } from "bun:test";
import {
	normalizeRepoSlug,
	parseRepoCoordinates,
} from "@/modules/github/github.utils";
import { buildTaskWhere } from "@/modules/task/task.filters";
import { boardRepository } from "../board.repository";
import { boardService } from "../board.service";

describe("github.utils repo parsing", () => {
	it("extracts owner and repo from slug or full GitHub URL", () => {
		expect(parseRepoCoordinates("clix002/boltflow")).toEqual({
			owner: "clix002",
			repo: "boltflow",
		});
		expect(
			parseRepoCoordinates("https://github.com/clix002/boltflow.git/"),
		).toEqual({
			owner: "clix002",
			repo: "boltflow",
		});
		expect(normalizeRepoSlug("https://github.com/clix002/boltflow")).toBe(
			"clix002/boltflow",
		);
	});
});

describe("buildTaskWhere", () => {
	it("builds filters for boltId, branchName, and search", () => {
		const where = buildTaskWhere({
			search: "  sidebar ",
			boltId: "bolt-2",
			branchName: "feature/board-detail-01",
			assigneeIds: ["user-1"],
		});

		expect(where).toEqual({
			OR: [
				{ title: { contains: "sidebar", mode: "insensitive" } },
				{ description: { contains: "sidebar", mode: "insensitive" } },
				{ branchName: { contains: "sidebar", mode: "insensitive" } },
			],
			assignees: {
				some: {
					id: { in: ["user-1"] },
				},
			},
			boltId: "bolt-2",
			branchName: "feature/board-detail-01",
		});
	});

	it("returns an empty object when all filters are blank", () => {
		expect(
			buildTaskWhere({
				search: "   ",
				boltId: undefined,
				branchName: " ",
			}),
		).toEqual({});
	});
});

describe("boardService Units and Bolts", () => {
	it("creates a unit with its own board when the user owns the board", async () => {
		const now = new Date();
		const findOwner = spyOn(
			boardRepository,
			"findOwnershipById",
		).mockResolvedValue({
			id: "board-1",
			ownerId: "user-1",
			githubRepo: "clix002/boltflow",
			defaultBranch: "main",
			owner: { githubToken: null },
		});
		const createUnit = spyOn(boardRepository, "createUnit").mockResolvedValue({
			id: "unit-1",
			boardId: "board-1",
			name: "Core & Schema",
			description: "Domain models",
			color: "#8b5cf6",
			branchName: "feature/unit-subboard-01",
			createdAt: now,
			updatedAt: now,
		});

		try {
			const unit = await boardService.createUnit({
				boardId: "board-1",
				userId: "user-1",
				data: {
					name: "Core & Schema",
					description: "Domain models",
					color: "#8b5cf6",
					branchName: "feature/unit-subboard-01",
				},
			});

			expect(unit.id).toBe("unit-1");
			expect(unit.name).toBe("Core & Schema");
			expect(unit.branchName).toBe("feature/unit-subboard-01");
		} finally {
			findOwner.mockRestore();
			createUnit.mockRestore();
		}
	});

	it("rejects unit update when the user is not the board owner", async () => {
		const findUnit = spyOn(
			boardRepository,
			"findUnitOwnershipById",
		).mockResolvedValue({
			id: "unit-1",
			boardId: "board-1",
			board: {
				ownerId: "owner-user",
				githubRepo: "clix002/boltflow",
				defaultBranch: "main",
				owner: { githubToken: null },
			},
		});

		try {
			await expect(
				boardService.updateUnit({
					boardId: "board-1",
					unitId: "unit-1",
					userId: "intruder-user",
					data: { name: "Hijacked" },
				}),
			).rejects.toMatchObject({ status: 403 });
		} finally {
			findUnit.mockRestore();
		}
	});

	it("updates bolt status when the bolt belongs to the unit and board owner", async () => {
		const now = new Date();
		const findBolt = spyOn(
			boardRepository,
			"findBoltOwnershipById",
		).mockResolvedValue({
			id: "bolt-1",
			unitId: "unit-1",
			unit: {
				boardId: "board-1",
				board: {
					ownerId: "user-1",
				},
			},
		});
		const updateBolt = spyOn(boardRepository, "updateBolt").mockResolvedValue({
			id: "bolt-1",
			unitId: "unit-1",
			name: "Bolt #3",
			goal: "Ship CRUD",
			status: "ACTIVE",
			startsAt: null,
			endsAt: null,
			createdAt: now,
			updatedAt: now,
		});

		try {
			const updated = await boardService.updateBolt({
				boardId: "board-1",
				boltId: "bolt-1",
				userId: "user-1",
				data: { status: "ACTIVE" },
			});

			expect(updated.status).toBe("ACTIVE");
		} finally {
			findBolt.mockRestore();
			updateBolt.mockRestore();
		}
	});
});
