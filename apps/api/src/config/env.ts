import { z } from "zod";

const EnvSchema = z
	.object({
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		PORT: z.coerce.number().default(3000),
		DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
		JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
		REFRESH_SECRET: z.string().min(1, "REFRESH_SECRET is required"),
		FRONTEND_URL: z.string().default("http://localhost:5173"),
		TRUST_PROXY: z
			.enum(["true", "false"])
			.default("false")
			.transform((value) => value === "true"),
	})
	.refine((value) => value.JWT_SECRET !== value.REFRESH_SECRET, {
		path: ["REFRESH_SECRET"],
		message: "REFRESH_SECRET must differ from JWT_SECRET",
	});

export const env = EnvSchema.parse(process.env);
export type EnvConfig = z.infer<typeof EnvSchema>;
