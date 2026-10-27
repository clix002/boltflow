import { OpenAPIHono, z } from "@hono/zod-openapi";
import type { Env } from "hono";

export const createRouter = <E extends Env = Env>() =>
	new OpenAPIHono<E>({
		defaultHook: (result, c) => {
			if (!result.success) {
				return c.json(
					{
						message: "Validation error",
						errors: z.flattenError(result.error),
					},
					400,
				);
			}
		},
	});
