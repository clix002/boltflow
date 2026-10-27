import { describe, expect, it } from "bun:test";
import { createRouter } from "@/lib/openapi";
import { meHandler, registerHandler } from "../auth.handlers";
import { meRoute, registerRoute } from "../auth.routes";

const testApp = createRouter();
testApp.openapi(meRoute, meHandler);
testApp.openapi(registerRoute, registerHandler);

describe("auth handlers & defaultHook", () => {
	it("responds 401 without access cookie on /me", async () => {
		const res = await testApp.request("/me");
		expect(res.status).toBe(401);
	});

	it("responds 400 with structured validation errors when body is invalid", async () => {
		const res = await testApp.request("/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: "not-an-email" }),
		});

		expect(res.status).toBe(400);
		const json = (await res.json()) as {
			message: string;
			errors: { fieldErrors: Record<string, string[]> };
		};
		expect(json.message).toBe("Validation error");
		expect(json.errors.fieldErrors).toBeDefined();
		expect(json.errors.fieldErrors.email).toBeDefined();
	});
});
