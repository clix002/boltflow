import { defineConfig, env } from "prisma/config";

export default defineConfig({
	schema: "src/db/prisma/schema/",
	migrations: {
		path: "src/db/migrations/",
		seed: "bun run src/db/prisma/seed.ts",
	},
	datasource: {
		url: env("DATABASE_URL"),
	},
});
