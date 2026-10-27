import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { rateLimit, resetRateLimits } from "@/middlewares/rate-limit";

const dummyRoute = createRoute({
	method: "post",
	path: "/login",
	responses: {
		200: {
			description: "ok",
		},
	},
});

const testApp = new OpenAPIHono();
testApp.use("/login", rateLimit);
testApp.openapi(dummyRoute, async (c) => c.json({ ok: true }));

const fireRequest = async (
	headers: Record<string, string> = {},
	socketIp = "127.0.0.1",
) =>
	testApp.request(
		"/login",
		{ method: "POST", headers },
		{
			requestIP: () => ({ address: socketIp, family: "IPv4", port: 1234 }),
		},
	);

describe("rate limiter", () => {
	beforeEach(() => {
		resetRateLimits();
	});

	it("allows up to 5 requests within the window", async () => {
		for (let i = 0; i < 5; i++) {
			const res = await fireRequest();
			expect(res.status).not.toBe(429);
		}
	});

	it("returns 429 on the 6th request", async () => {
		for (let i = 0; i < 5; i++) {
			await fireRequest();
		}
		const sixth = await fireRequest();
		expect(sixth.status).toBe(429);
		expect(sixth.headers.get("Retry-After")).not.toBeNull();
	});

	it("isolates requests by client IP", async () => {
		for (let i = 0; i < 5; i++) {
			await fireRequest();
		}
		const isolated = await fireRequest({}, "10.0.0.1");
		expect(isolated.status).not.toBe(429);
	});

	it("ignores client supplied IP headers without a trusted proxy", async () => {
		for (let i = 0; i < 5; i++) {
			await fireRequest({ "cf-connecting-ip": `1.0.0.${i}` });
		}
		const sixth = await fireRequest({
			"cf-connecting-ip": "1.0.0.6",
			"x-real-ip": "2.0.0.6",
			"x-forwarded-for": "3.0.0.6",
		});
		expect(sixth.status).toBe(429);
	});

	it("evicts old client buckets when capacity is reached", async () => {
		const clock = spyOn(Date, "now").mockReturnValue(1_000_000);
		try {
			for (let i = 0; i < 5; i++) {
				await fireRequest({}, "192.0.2.1");
			}
			for (let i = 0; i < 5_000; i++) {
				await fireRequest({}, `198.51.${Math.floor(i / 256)}.${i % 256}`);
			}
			const afterEviction = await fireRequest({}, "192.0.2.1");
			expect(afterEviction.status).not.toBe(429);
		} finally {
			clock.mockRestore();
		}
	});
});
