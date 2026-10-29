import { z } from "zod";
import { ColumnSchema } from "../column";

export const PrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export type Priority = z.infer<typeof PrioritySchema>;

export const PrStatusSchema = z.enum([
	"NONE",
	"DRAFT",
	"OPEN",
	"MERGED",
	"CLOSED",
]);
export type PrStatus = z.infer<typeof PrStatusSchema>;

export const TaskUnitRefSchema = z.object({
	id: z.string(),
	name: z.string(),
	color: z.string(),
});
export type TaskUnitRef = z.infer<typeof TaskUnitRefSchema>;

export const TaskBoltRefSchema = z.object({
	id: z.string(),
	name: z.string(),
	status: z.enum(["PLANNED", "ACTIVE", "COMPLETED"]),
});
export type TaskBoltRef = z.infer<typeof TaskBoltRefSchema>;

export const TaskSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable().optional(),
	order: z.number(),
	priority: PrioritySchema,
	branchName: z.string().nullable().optional(),
	prNumber: z.number().nullable().optional(),
	prUrl: z.string().nullable().optional(),
	prStatus: PrStatusSchema.optional(),
	unitId: z.string().nullable().optional(),
	boltId: z.string().nullable().optional(),
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
	order: z.number().int().nonnegative().optional(),
	priority: PrioritySchema.optional(),
	unitId: z.string().nullable().optional(),
	boltId: z.string().nullable().optional(),
	branchName: z.string().nullable().optional(),
});

export const UpdateTaskSchema = z.object({
	title: z.string().min(1).max(200).optional(),
	description: z.string().nullable().optional(),
	columnId: z.string().optional(),
	assigneeIds: z.array(z.string()).optional(),
	order: z.number().int().nonnegative().optional(),
	priority: PrioritySchema.optional(),
	unitId: z.string().nullable().optional(),
	boltId: z.string().nullable().optional(),
	branchName: z.string().nullable().optional(),
});

export const CreateTaskBranchSchema = z.object({
	branchName: z.string().min(1).max(120),
	createOnGitHub: z.boolean().optional(),
});

export const MoveTaskSchema = z.object({
	columnId: z.string(),
	order: z.number().int().nonnegative().optional(),
});

export const AssigneeSchema = z.object({
	id: z.string(),
	name: z.string(),
	avatarUrl: z.string().nullable().optional(),
});

export const TaskWithAssigneesSchema = TaskSchema.extend({
	assignees: z.array(AssigneeSchema),
	unit: TaskUnitRefSchema.nullable().optional(),
	bolt: TaskBoltRefSchema.nullable().optional(),
});

export const ColumnWithTasksSchema = ColumnSchema.extend({
	tasks: z.array(TaskWithAssigneesSchema),
});
