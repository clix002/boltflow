import { compact, isString, trim } from "es-toolkit";
import { z } from "zod";
import type { Maybe } from "../types";

export function trimToNull(value?: Maybe<string>): Maybe<string> {
	if (!isString(value)) return null;
	return trim(value) || null;
}

export const TrimmedString = (maxLength: number) =>
	z.string().trim().min(1).max(maxLength);

export const NullableTrimmedString = (maxLength: number) =>
	z
		.string()
		.trim()
		.max(maxLength)
		.transform((val): Maybe<string> => val || null)
		.nullable()
		.optional();

export const CommaSeparatedArray = z.preprocess(
	(val) => (isString(val) ? compact(val.split(",").map((s) => trim(s))) : val),
	z.array(z.string()).optional(),
);

export const GITHUB_WEB_BASE_URL = "https://github.com" as const;

export function buildGitHubRepoUrl(repoSlug?: Maybe<string>): Maybe<string> {
	const cleanedRepo = trimToNull(repoSlug);
	if (!cleanedRepo) return null;
	return `${GITHUB_WEB_BASE_URL}/${cleanedRepo}`;
}

export function buildGitHubBranchUrl(
	repoSlug?: Maybe<string>,
	branchName?: Maybe<string>,
): Maybe<string> {
	const cleanedRepo = trimToNull(repoSlug);
	const cleanedBranch = trimToNull(branchName);
	if (!cleanedRepo || !cleanedBranch) return null;
	return `${GITHUB_WEB_BASE_URL}/${cleanedRepo}/tree/${cleanedBranch}`;
}

export function buildGitHubOwnerAvatarUrl(
	repoSlug?: Maybe<string>,
): Maybe<string> {
	const cleanedRepo = trimToNull(repoSlug);
	if (!cleanedRepo) return null;
	const owner = trimToNull(cleanedRepo.split("/")[0]);
	if (!owner) return null;
	return `${GITHUB_WEB_BASE_URL}/${owner}.png?size=128`;
}
