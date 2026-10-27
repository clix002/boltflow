import type { RouteHandler } from "@hono/zod-openapi";
import type { AppEnv } from "@/modules/auth/types";
import { userRepository } from "./user.repository";
import type { listUsersRoute } from "./user.routes";

export const listUsersHandler: RouteHandler<
	typeof listUsersRoute,
	AppEnv
> = async (c) => {
	const users = await userRepository.findAll();
	return c.json(users, 200);
};
