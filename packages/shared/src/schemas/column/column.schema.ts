import { z } from "zod";
import { TrimmedString } from "../common";

export const ColumnSchema = z.object({
	id: z.string(),
	name: z.string(),
	order: z.number(),
	unitId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const CreateColumnSchema = z.object({
	name: TrimmedString(100),
	unitId: TrimmedString(100),
	order: z.number().int().nonnegative().optional(),
});

export const UpdateColumnSchema = z.object({
	name: TrimmedString(100).optional(),
	order: z.number().int().nonnegative().optional(),
});
