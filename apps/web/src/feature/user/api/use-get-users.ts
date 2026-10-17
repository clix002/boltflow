import type { UserResponseSchema } from "@scrum-board/shared/schemas";
import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";
import { api } from "@/lib/api";

type User = z.infer<typeof UserResponseSchema>;

export const useGetUsersQuery = () => {
	return useQuery({
		queryKey: ["users"],
		queryFn: () => api.get<User[]>("/users"),
	});
};
