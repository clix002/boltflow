import { describe, expect, it } from "bun:test";
import {
	isHttpStatusError,
	parseRepoCoordinates,
	sanitizeBranchName,
} from "../github.utils";

describe("github.utils", () => {
	describe("parseRepoCoordinates", () => {
		it("parses valid owner/repo coordinates", () => {
			expect(parseRepoCoordinates("clix002/boltflow")).toEqual({
				owner: "clix002",
				repo: "boltflow",
			});
			expect(parseRepoCoordinates("  clix002/boltflow  ")).toEqual({
				owner: "clix002",
				repo: "boltflow",
			});
		});

		it("returns null for invalid or empty repository strings", () => {
			expect(parseRepoCoordinates(null)).toBeNull();
			expect(parseRepoCoordinates(undefined)).toBeNull();
			expect(parseRepoCoordinates("")).toBeNull();
			expect(parseRepoCoordinates("invalid-repo")).toBeNull();
			expect(parseRepoCoordinates("owner/")).toBeNull();
			expect(parseRepoCoordinates("/repo")).toBeNull();
			expect(parseRepoCoordinates("a/b/c")).toBeNull();
		});
	});

	describe("sanitizeBranchName", () => {
		it("normalizes branch segments into kebab-case while preserving slashes", () => {
			expect(sanitizeBranchName("feature/Add Units & Bolts CRUD")).toBe(
				"feature/add-units-bolts-crud",
			);
			expect(sanitizeBranchName("  fix//broken_login  ")).toBe(
				"fix/broken-login",
			);
		});
	});

	describe("isHttpStatusError", () => {
		it("matches objects with the expected numeric status property", () => {
			expect(
				isHttpStatusError({ status: 404, message: "Not Found" }, 404),
			).toBe(true);
			expect(isHttpStatusError({ status: 500 }, 404)).toBe(false);
			expect(isHttpStatusError(null, 404)).toBe(false);
			expect(isHttpStatusError("error", 404)).toBe(false);
		});
	});
});
