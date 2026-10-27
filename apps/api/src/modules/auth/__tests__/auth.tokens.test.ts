import { describe, expect, it } from "bun:test";
import { HTTPException } from "hono/http-exception";
import {
	signAccessToken,
	signRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
} from "../auth.tokens";

describe("auth.tokens", () => {
	it("access token roundtrips userId", async () => {
		const token = await signAccessToken("user-123");
		const userId = await verifyAccessToken(token);
		expect(userId).toBe("user-123");
	});

	it("refresh token roundtrips userId", async () => {
		const token = await signRefreshToken("user-456");
		const userId = await verifyRefreshToken(token);
		expect(userId).toBe("user-456");
	});

	it("rejects garbage tokens with 401 HTTPException", async () => {
		try {
			await verifyAccessToken("not.a.token");
			expect.unreachable("should have thrown");
		} catch (err) {
			expect(err).toBeInstanceOf(HTTPException);
			expect((err as HTTPException).status).toBe(401);
		}
	});

	it("refresh secret can't verify access token (returns 401)", async () => {
		const token = await signAccessToken("user-123");
		try {
			await verifyRefreshToken(token);
			expect.unreachable("should have thrown");
		} catch (err) {
			expect(err).toBeInstanceOf(HTTPException);
			expect((err as HTTPException).status).toBe(401);
		}
	});
});
