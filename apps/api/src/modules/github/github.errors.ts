import { Schema } from "effect";

export class InvalidBranchNameError extends Schema.TaggedError<InvalidBranchNameError>()(
	"InvalidBranchNameError",
	{
		rawName: Schema.String,
	},
) {}

export class GitHubBranchNotFoundError extends Schema.TaggedError<GitHubBranchNotFoundError>()(
	"GitHubBranchNotFoundError",
	{
		owner: Schema.String,
		repo: Schema.String,
		branch: Schema.String,
	},
) {}

export class GitHubApiError extends Schema.TaggedError<GitHubApiError>()(
	"GitHubApiError",
	{
		message: Schema.String,
	},
) {}
