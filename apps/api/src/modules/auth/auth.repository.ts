import { prisma } from "@/db/connections";
import type { Prisma } from "@/db/prisma/generated/client";

export const safeUserSelect = {
	id: true,
	email: true,
	name: true,
	avatarUrl: true,
} satisfies Prisma.UserSelect;

export type CreateUserInput = {
	email: string;
	name: string;
	passwordHash: string;
};

export const authRepository = {
	findByEmail(email: string) {
		return prisma.user.findUnique({
			where: { email },
			select: { id: true },
		});
	},
	findByEmailForAuth(email: string) {
		return prisma.user.findUnique({
			where: { email },
			select: { ...safeUserSelect, password: true },
		});
	},

	findById(id: string) {
		return prisma.user.findUnique({
			where: { id },
			select: safeUserSelect,
		});
	},

	create(input: CreateUserInput) {
		return prisma.user.create({
			data: {
				email: input.email,
				name: input.name,
				password: input.passwordHash,
			},
			select: safeUserSelect,
		});
	},
};
