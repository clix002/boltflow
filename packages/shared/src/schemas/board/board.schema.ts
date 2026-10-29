import { z } from "zod";
import { ColumnWithTasksSchema } from "../task";

export const UnitSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	color: z.string(),
	boardId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type Unit = z.infer<typeof UnitSchema>;

export const BoltStatusSchema = z.enum(["PLANNED", "ACTIVE", "COMPLETED"]);
export type BoltStatus = z.infer<typeof BoltStatusSchema>;

export const BoltSchema = z.object({
	id: z.string(),
	name: z.string(),
	goal: z.string().nullable().optional(),
	status: BoltStatusSchema,
	startsAt: z.string().nullable().optional(),
	endsAt: z.string().nullable().optional(),
	boardId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type Bolt = z.infer<typeof BoltSchema>;

export const GitHubBranchSchema = z.object({
	name: z.string(),
	sha: z.string(),
	isDefault: z.boolean(),
	protected: z.boolean(),
});
export type GitHubBranch = z.infer<typeof GitHubBranchSchema>;

export const BoardGitHubInfoSchema = z.object({
	repo: z.string().nullable(),
	defaultBranch: z.string(),
	connected: z.boolean(),
	branches: z.array(GitHubBranchSchema),
});
export type BoardGitHubInfo = z.infer<typeof BoardGitHubInfoSchema>;

export const BoardSchema = z.object({
	id: z.string(),
	name: z.string(),
	githubRepo: z.string().nullable().optional(),
	defaultBranch: z.string().optional(),
	ownerId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const CreateBoardSchema = z.object({
	name: z.string().min(1).max(100),
	githubRepo: z.string().max(120).optional(),
	defaultBranch: z.string().max(80).optional(),
});

export const UpdateBoardSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	githubRepo: z.string().max(120).nullable().optional(),
	defaultBranch: z.string().max(80).optional(),
});

export const BoardDetailResponseSchema = BoardSchema.extend({
	columns: z.array(ColumnWithTasksSchema),
	units: z.array(UnitSchema).optional(),
	bolts: z.array(BoltSchema).optional(),
});
