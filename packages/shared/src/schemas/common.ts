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
