import { prisma } from "@/db/connections";

export const userRepository = {
	findAll() {
		return prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				avatarUrl: true,
			},
			orderBy: { name: "asc" },
		});
	},
};
