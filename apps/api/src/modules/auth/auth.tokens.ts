import { randomUUIDv7 } from "bun";
import { isString } from "es-toolkit/predicate";
import { HTTPException } from "hono/http-exception";
import { errors, jwtVerify, SignJWT } from "jose";
import { env } from "@/config/env";

const ACCESS_SECRET = () => new TextEncoder().encode(env.JWT_SECRET);
const REFRESH_SECRET = () => new TextEncoder().encode(env.REFRESH_SECRET);

const ACCESS_DURATION = "15m";
const REFRESH_DURATION = "7d";

export const signAccessToken = async (userId: string) => {
	return await new SignJWT({ id: userId })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(ACCESS_DURATION)
		.sign(ACCESS_SECRET());
};

export const signRefreshToken = async (userId: string) => {
	return await new SignJWT({ id: userId, jti: randomUUIDv7() })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(REFRESH_DURATION)
		.sign(REFRESH_SECRET());
};

export const verifyAccessToken = async (token: string): Promise<string> => {
	try {
		const { payload } = await jwtVerify(token, ACCESS_SECRET());
		if (!isString(payload.id)) {
			throw new HTTPException(401, { message: "Invalid token payload" });
		}
		return payload.id;
	} catch (err) {
		if (err instanceof HTTPException) throw err;
		if (err instanceof errors.JOSEError) {
			throw new HTTPException(401, { message: "Invalid or expired token" });
		}
		throw err;
	}
};

export const verifyRefreshToken = async (token: string): Promise<string> => {
	try {
		const { payload } = await jwtVerify(token, REFRESH_SECRET());
		if (!isString(payload.id)) {
			throw new HTTPException(401, { message: "Invalid token payload" });
		}
		return payload.id;
	} catch (err) {
		if (err instanceof HTTPException) throw err;
		if (err instanceof errors.JOSEError) {
			throw new HTTPException(401, { message: "Invalid or expired token" });
		}
		throw err;
	}
};
