import { z } from "zod";
import { NullableTrimmedString, TrimmedString } from "../common";
import { ColumnWithTasksSchema } from "../task";

export const BoltStatusSchema = z.enum(["PLANNED", "ACTIVE", "COMPLETED"]);
export const BOLT_STATUS = BoltStatusSchema.enum;
export type BoltStatus = z.infer<typeof BoltStatusSchema>;

export const DEFAULT_UNIT_COLOR = "#8b5cf6";

export const BoltSchema = z.object({
	id: z.string(),
	name: z.string(),
	goal: z.string().nullable().optional(),
	status: BoltStatusSchema,
	startsAt: z.string().nullable().optional(),
	endsAt: z.string().nullable().optional(),
	unitId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type Bolt = z.infer<typeof BoltSchema>;

export const CreateBoltSchema = z.object({
	unitId: TrimmedString(100),
	name: TrimmedString(100),
	goal: NullableTrimmedString(500),
	status: BoltStatusSchema.optional(),
});
export type CreateBoltInput = z.infer<typeof CreateBoltSchema>;

export const UpdateBoltSchema = z.object({
	name: TrimmedString(100).optional(),
	goal: NullableTrimmedString(500),
	status: BoltStatusSchema.optional(),
});
export type UpdateBoltInput = z.infer<typeof UpdateBoltSchema>;

export const UnitSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	color: z.string(),
	branchName: z.string().nullable().optional(),
	boardId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type Unit = z.infer<typeof UnitSchema>;

export const UnitWithBoardSchema = UnitSchema.extend({
	columns: z.array(ColumnWithTasksSchema),
	bolts: z.array(BoltSchema),
});
export type UnitWithBoard = z.infer<typeof UnitWithBoardSchema>;

export const CreateUnitSchema = z.object({
	name: TrimmedString(100),
	description: NullableTrimmedString(500),
	color: TrimmedString(32).optional(),
	branchName: NullableTrimmedString(120),
	createBranchOnGitHub: z.boolean().optional(),
});
export type CreateUnitInput = z.infer<typeof CreateUnitSchema>;

export const UpdateUnitSchema = z.object({
	name: TrimmedString(100).optional(),
	description: NullableTrimmedString(500),
	color: TrimmedString(32).optional(),
	branchName: NullableTrimmedString(120),
	createBranchOnGitHub: z.boolean().optional(),
});
export type UpdateUnitInput = z.infer<typeof UpdateUnitSchema>;

export const GitHubBranchSchema = z.object({
	name: z.string(),
	sha: z.string(),
	isDefault: z.boolean(),
	protected: z.boolean(),
});
export type GitHubBranch = z.infer<typeof GitHubBranchSchema>;

export const GitHubRepoItemSchema = z.object({
	id: z.number(),
	name: z.string(),
	fullName: z.string(),
	defaultBranch: z.string(),
	private: z.boolean(),
});
export type GitHubRepoItem = z.infer<typeof GitHubRepoItemSchema>;

export const UserGitHubReposResponseSchema = z.object({
	connected: z.boolean(),
	repos: z.array(GitHubRepoItemSchema),
});
export type UserGitHubReposResponse = z.infer<
	typeof UserGitHubReposResponseSchema
>;

export const ConnectGitHubTokenSchema = z.object({
	githubToken: TrimmedString(255),
});
export type ConnectGitHubTokenInput = z.infer<typeof ConnectGitHubTokenSchema>;

export const BoardGitHubInfoSchema = z.object({
	repo: z.string().nullable(),
	defaultBranch: z.string(),
	connected: z.boolean(),
	hasToken: z.boolean().optional(),
	branches: z.array(GitHubBranchSchema),
});
export type BoardGitHubInfo = z.infer<typeof BoardGitHubInfoSchema>;

export const BoardSchema = z.object({
	id: z.string(),
	name: z.string(),
	iconUrl: z.string().nullable().optional(),
	githubRepo: z.string().nullable().optional(),
	defaultBranch: z.string().optional(),
	unitCount: z.number().int().nonnegative().optional(),
	activeBoltCount: z.number().int().nonnegative().optional(),
	ownerId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const CreateBoardSchema = z.object({
	name: TrimmedString(100),
	iconUrl: NullableTrimmedString(25000),
	githubRepo: NullableTrimmedString(200),
	defaultBranch: TrimmedString(80).optional(),
});

export const UpdateBoardSchema = z.object({
	name: TrimmedString(100).optional(),
	iconUrl: NullableTrimmedString(25000),
	githubRepo: NullableTrimmedString(200),
	defaultBranch: TrimmedString(80).optional(),
});

export const BoardDetailResponseSchema = BoardSchema.extend({
	units: z.array(UnitWithBoardSchema),
});
