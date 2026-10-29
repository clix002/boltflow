import { trimToNull } from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { compact, kebabCase, trim } from "es-toolkit";

export type RepoCoordinates = {
	owner: string;
	repo: string;
};

const GITHUB_URL_PREFIX = /^https?:\/\/(www\.)?github\.com\//i;
const GIT_SUFFIX = /\.git$/i;

export const parseRepoCoordinates = (
	fullRepo: Maybe<string | undefined>,
): Maybe<RepoCoordinates> => {
	const trimmed = trimToNull(fullRepo);
	if (!trimmed) {
		return null;
	}

	const cleaned = trim(trimmed, "/")
		.replace(GITHUB_URL_PREFIX, "")
		.replace(GIT_SUFFIX, "");
	const parts = cleaned.split("/");
	if (parts.length !== 2) {
		return null;
	}

	const [owner, repo] = parts;
	if (!owner || !repo) {
		return null;
	}

	return { owner, repo };
};

export const normalizeRepoSlug = (
	fullRepo: Maybe<string | undefined>,
): Maybe<string> => {
	const coords = parseRepoCoordinates(fullRepo);
	return coords ? `${coords.owner}/${coords.repo}` : trimToNull(fullRepo);
};

export const sanitizeBranchName = (rawName: string): string => {
	const segments = compact(
		trim(rawName)
			.split("/")
			.map((segment) => kebabCase(segment)),
	);

	return segments.join("/");
};

export const isHttpStatusError = (
	error: unknown,
	statusCode: number,
): boolean => {
	return (
		typeof error === "object" &&
		error !== null &&
		"status" in error &&
		error.status === statusCode
	);
};
