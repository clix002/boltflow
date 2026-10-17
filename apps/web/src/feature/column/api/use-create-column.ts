import type {
	ColumnSchema,
	CreateColumnSchema,
} from "@scrum-board/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";
import { api } from "@/lib/api";

type CreateColumnInput = z.infer<typeof CreateColumnSchema>;
type Column = z.infer<typeof ColumnSchema>;

export const useCreateColumnMutation = () => {
	return useMutation({
		mutationFn: (data: CreateColumnInput) => api.post<Column>("/columns", data),
		onSuccess: () => {
			toast.success("Column created successfully");
		},
		onError: () => {
			toast.error("Failed to create column");
		},
	});
};
