import type {
	ColumnSchema,
	UpdateColumnSchema,
} from "@scrum-board/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";
import { api } from "@/lib/api";

type UpdateColumnInput = z.infer<typeof UpdateColumnSchema>;
type Column = z.infer<typeof ColumnSchema>;

export const useUpdateColumnMutation = () => {
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateColumnInput }) =>
			api.put<Column>(`/columns/${id}`, data),
		onSuccess: () => {
			toast.success("Column updated successfully");
		},
		onError: () => {
			toast.error("Failed to update column");
		},
	});
};
