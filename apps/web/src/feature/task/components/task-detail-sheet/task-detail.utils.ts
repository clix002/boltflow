import type { Block, PartialBlock } from "@blocknote/core";
import type { Maybe } from "@scrum-board/shared/types";
import { kebabCase } from "es-toolkit";

const BLOCK_TYPE = {
	PARAGRAPH: "paragraph",
	HEADING: "heading",
} as const;

export const SELECT_UNSET_VALUE = "unset" as const;

export function toOptionalSelectValue(
	value: Maybe<string | undefined>,
): string {
	return value ?? SELECT_UNSET_VALUE;
}

export function fromOptionalSelectValue(value: string): Maybe<string> {
	return value === SELECT_UNSET_VALUE ? null : value;
}

export function formatTaskDateTime(dateString: string): string {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isPartialBlockArray(value: unknown): value is PartialBlock[] {
	return (
		Array.isArray(value) &&
		value.length > 0 &&
		value.every((item) => isRecord(item))
	);
}

export function parseTaskEditorBlocks(
	description?: Maybe<string>,
): Maybe<PartialBlock[]> {
	if (!description?.trim()) {
		return null;
	}

	try {
		const parsed: unknown = JSON.parse(description);
		if (isPartialBlockArray(parsed)) {
			return parsed;
		}
	} catch {
		// Legacy plain-text description fallback
	}

	return description.split("\n").map((line) => ({
		type: BLOCK_TYPE.PARAGRAPH,
		content: line,
	})) satisfies PartialBlock[];
}

function extractInlineText(content: unknown): string {
	if (typeof content === "string") {
		return content;
	}
	if (!Array.isArray(content)) {
		return "";
	}
	return content
		.map((item) => {
			if (isRecord(item) && typeof item.text === "string") {
				return item.text;
			}
			return "";
		})
		.join("");
}

export function getTaskDescriptionPreview(description?: Maybe<string>): string {
	if (!description?.trim()) {
		return "";
	}

	try {
		const parsed: unknown = JSON.parse(description);
		if (Array.isArray(parsed)) {
			const nonHeadingBlocks = parsed.filter(
				(block) => isRecord(block) && block.type !== BLOCK_TYPE.HEADING,
			);
			const sourceBlocks =
				nonHeadingBlocks.length > 0 ? nonHeadingBlocks : parsed;

			return sourceBlocks
				.map((block) => {
					if (isRecord(block) && "content" in block) {
						return extractInlineText(block.content);
					}
					return "";
				})
				.filter(Boolean)
				.join(" ");
		}
	} catch {
		// Plain text
	}

	return description;
}

export function serializeTaskEditorBlocks(blocks: Block[]): Maybe<string> {
	const hasContent = blocks.some((block) => {
		const text = extractInlineText(block.content).trim();
		return text.length > 0 || (block.children && block.children.length > 0);
	});

	if (!hasContent) {
		return null;
	}

	return JSON.stringify(blocks);
}

export function buildSuggestedBranchName(title: string): string {
	const slug = kebabCase(title).slice(0, 36);
	return `feat/${slug || "task"}`;
}
