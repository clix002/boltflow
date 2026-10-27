import type { z } from "@hono/zod-openapi";
import type { LoginSchema, RegisterSchema } from "@scrum-board/shared/schemas";
import { omit } from "es-toolkit";
import { HTTPException } from "hono/http-exception";
import { authRepository } from "./auth.repository";
import {
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken,
} from "./auth.tokens";

export const registerUser = async (data: z.infer<typeof RegisterSchema>) => {
	const { email, password, name } = data;

	const existingUser = await authRepository.findByEmail(email);

	if (existingUser) {
		throw new HTTPException(409, { message: "User already exists" });
	}

	const hashedPassword = await Bun.password.hash(password);

	const user = await authRepository.create({
		email,
		name,
		passwordHash: hashedPassword,
	});

	const accessToken = await signAccessToken(user.id);
	const refreshToken = await signRefreshToken(user.id);

	return {
		user,
		accessToken,
		refreshToken,
	};
};

export const loginUser = async (data: z.infer<typeof LoginSchema>) => {
	const { email, password } = data;

	const user = await authRepository.findByEmailForAuth(email);

	if (!user) {
		throw new HTTPException(401, { message: "Invalid credentials" });
	}

	const isPasswordValid = await Bun.password.verify(password, user.password);

	if (!isPasswordValid) {
		throw new HTTPException(401, { message: "Invalid credentials" });
	}

	const accessToken = await signAccessToken(user.id);
	const refreshToken = await signRefreshToken(user.id);

	return {
		user: omit(user, ["password"]),
		accessToken,
		refreshToken,
	};
};

export const refreshSession = async (refreshToken: string) => {
	const userId = await verifyRefreshToken(refreshToken);

	const accessToken = await signAccessToken(userId);
	const refreshTokenNew = await signRefreshToken(userId);

	return {
		accessToken,
		refreshToken: refreshTokenNew,
	};
};
