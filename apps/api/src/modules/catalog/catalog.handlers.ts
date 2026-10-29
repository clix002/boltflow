import type { RouteHandler } from "@hono/zod-openapi";
import type { AppEnv } from "@/modules/auth/types";
import type { getCatalogBySlugRoute } from "./catalog.routes";
import { catalogService } from "./catalog.service";

export const getCatalogBySlugHandler: RouteHandler<
	typeof getCatalogBySlugRoute,
	AppEnv
> = async (c) => {
	const { slug } = c.req.valid("param");
	const options = catalogService.getBySlug(slug);
	return c.json(options, 200);
};
