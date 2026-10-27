import { describe, expect, it, spyOn } from "bun:test";
import { authRepository } from "../auth.repository";
import { loginUser, refreshSession } from "../auth.service";
import { signRefreshToken } from "../auth.tokens";

describe("auth.service.refreshSession", () => {
	it("regenerates new tokens from a valid refresh token", async () => {
		const refreshToken = await signRefreshToken("user-abc");

		const { accessToken, refreshToken: newRefresh } =
			await refreshSession(refreshToken);

		expect(accessToken).toBeString();
		expect(newRefresh).toBeString();
		expect(newRefresh).not.toBe(refreshToken);
	});

	it("rejects a garbage refresh token", async () => {
		await expect(refreshSession("not.a.token")).rejects.toThrow();
	});
});

describe("auth.service.loginUser", () => {
	it("does not include the password in the returned user", async () => {
		const password = await Bun.password.hash("correct-password");
		const findUser = spyOn(
			authRepository,
			"findByEmailForAuth",
		).mockResolvedValue({
			id: "user-123",
			email: "user@example.com",
			name: "User",
			avatarUrl: null,
			password,
		});
		try {
			const result = await loginUser({
				email: "user@example.com",
				password: "correct-password",
			});
			expect(result.user).toEqual({
				id: "user-123",
				email: "user@example.com",
				name: "User",
				avatarUrl: null,
			});
		} finally {
			findUser.mockRestore();
		}
	});
});
