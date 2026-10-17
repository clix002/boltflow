import { z } from "zod";

export const ColumnSchema = z.object({
	id: z.string(),
	name: z.string(),
	order: z.number(),
	boardId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const CreateColumnSchema = z.object({
	name: z.string().min(1).max(100),
	boardId: z.string(),
	order: z.number().optional(),
});

export const UpdateColumnSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	order: z.number().optional(),
});
