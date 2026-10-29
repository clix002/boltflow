import { describe, expect, it } from "bun:test";
import { BOLT_STATUS, CATALOG_SLUG } from "@scrum-board/shared/schemas";
import { catalogService } from "../catalog.service";

describe("catalogService", () => {
	it("returns bolt-status options", () => {
		const options = catalogService.getBySlug(CATALOG_SLUG.BOLT_STATUS);
		expect(options).toEqual([
			{ value: BOLT_STATUS.PLANNED, label: "Planned" },
			{ value: BOLT_STATUS.ACTIVE, label: "Active" },
			{ value: BOLT_STATUS.COMPLETED, label: "Completed" },
		]);
	});

	it("returns unit-color presets with color metadata", () => {
		const options = catalogService.getBySlug(CATALOG_SLUG.UNIT_COLOR);
		expect(options.length).toBeGreaterThan(0);
		expect(options[0]).toEqual({
			value: "#8b5cf6",
			label: "Violet",
			color: "#8b5cf6",
		});
	});
});
