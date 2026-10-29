import { trimToNull } from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { compact, kebabCase, trim } from "es-toolkit";

export type RepoCoordinates = {
	owner: string;
	repo: string;
};

export const parseRepoCoordinates = (
	fullRepo: Maybe<string | undefined>,
): Maybe<RepoCoordinates> => {
	const trimmed = trimToNull(fullRepo);
	if (!trimmed) {
		return null;
	}

	const parts = trimmed.split("/");
	if (parts.length !== 2) {
		return null;
	}

	const [owner, repo] = parts;
	if (!owner || !repo) {
		return null;
	}

	return { owner, repo };
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
