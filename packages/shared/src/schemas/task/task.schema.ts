import { z } from "zod";
import { ColumnSchema } from "../column";

export const TaskSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable().optional(),
	order: z.number(),
	columnId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const AssigneeRefSchema = z.object({
	id: z.string(),
});

export const CreateTaskSchema = z.object({
	title: z.string().min(1).max(200),
	description: z.string().optional(),
	columnId: z.string(),
	assigneeIds: z.array(z.string()).optional(),
	order: z.number().optional(),
});

export const UpdateTaskSchema = z.object({
	title: z.string().min(1).max(200).optional(),
	description: z.string().nullable().optional(),
	columnId: z.string().optional(),
	assigneeIds: z.array(z.string()).optional(),
	order: z.number().optional(),
});

export const AssigneeSchema = z.object({
	id: z.string(),
	name: z.string(),
	avatarUrl: z.string().nullable().optional(),
});

export const TaskWithAssigneesSchema = TaskSchema.extend({
	assignees: z.array(AssigneeSchema),
});

export const ColumnWithTasksSchema = ColumnSchema.extend({
	tasks: z.array(TaskWithAssigneesSchema),
});
