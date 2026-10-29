import type { Block, PartialBlock } from "@blocknote/core";
import { trimToNull } from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { compact, kebabCase, trim } from "es-toolkit";

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
	const cleaned = trimToNull(description);
	if (!cleaned) {
		return null;
	}

	try {
		const parsed: unknown = JSON.parse(cleaned);
		if (isPartialBlockArray(parsed)) {
			return parsed;
		}
	} catch {
		// Legacy plain-text description fallback
	}

	return cleaned.split("\n").map((line) => ({
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
	const cleaned = trimToNull(description);
	if (!cleaned) {
		return "";
	}

	try {
		const parsed: unknown = JSON.parse(cleaned);
		if (Array.isArray(parsed)) {
			const nonHeadingBlocks = parsed.filter(
				(block) => isRecord(block) && block.type !== BLOCK_TYPE.HEADING,
			);
			const sourceBlocks =
				nonHeadingBlocks.length > 0 ? nonHeadingBlocks : parsed;

			return compact(
				sourceBlocks.map((block) => {
					if (isRecord(block) && "content" in block) {
						return extractInlineText(block.content);
					}
					return "";
				}),
			).join(" ");
		}
	} catch {
		// Plain text
	}

	return cleaned;
}

export function serializeTaskEditorBlocks(blocks: Block[]): Maybe<string> {
	const hasContent = blocks.some((block) => {
		const text = trim(extractInlineText(block.content));
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
