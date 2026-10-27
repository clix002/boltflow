import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { ACCESS_COOKIE } from "@/modules/auth/auth.cookies";
import { verifyAccessToken } from "@/modules/auth/auth.tokens";
import type { AppEnv } from "@/modules/auth/types";

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
	const token = getCookie(c, ACCESS_COOKIE);

	if (!token) {
		throw new HTTPException(401, {
			message: "Invalid Authorization header format",
		});
	}

	const userId = await verifyAccessToken(token);
	c.set("jwtPayload", { id: userId });

	await next();
});
