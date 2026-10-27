import { z } from "@hono/zod-openapi";

const EnvSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
	JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
	REFRESH_SECRET: z.string().min(1, "REFRESH_SECRET is required"),
	FRONTEND_URL: z.string().default("http://localhost:5173"),
});

export const env = EnvSchema.parse(process.env);
export type EnvConfig = z.infer<typeof EnvSchema>;
