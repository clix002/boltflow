import type { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { env } from "@/config/env";

const isProd = () => env.NODE_ENV === "production";

export const ACCESS_COOKIE = "scrum_access";
export const REFRESH_COOKIE = "scrum_refresh";

const baseOptions = () =>
	({
		httpOnly: true,
		secure: isProd(),
		sameSite: "Lax",
		path: "/",
	}) as const;

export const setAccessCookie = (c: Context, token: string) => {
	setCookie(c, ACCESS_COOKIE, token, {
		...baseOptions(),
		maxAge: 60 * 15,
	});
};

export const setRefreshCookie = (c: Context, token: string) => {
	setCookie(c, REFRESH_COOKIE, token, {
		...baseOptions(),
		maxAge: 60 * 60 * 24 * 7,
	});
};

export const clearAuthCookies = (c: Context) => {
	deleteCookie(c, ACCESS_COOKIE, { path: "/" });
	deleteCookie(c, REFRESH_COOKIE, { path: "/" });
};
