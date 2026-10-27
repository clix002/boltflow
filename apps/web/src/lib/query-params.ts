import { isNotNil, mapValues, pick, pickBy } from "es-toolkit";

export function parseQueryParams<
	T extends Record<string, unknown>,
	K extends keyof T & string,
>(source: URLSearchParams | T | undefined, keys: readonly K[]) {
	if (!source) {
		return { params: {}, queryString: "" };
	}

	const raw =
		source instanceof URLSearchParams ? Object.fromEntries(source) : source;

	const picked = pick(raw, keys);
	const valid = pickBy(
		picked,
		(val) => isNotNil(val) && String(val).trim() !== "",
	);
	const params = mapValues(valid, (val) => String(val).trim());
	const str = new URLSearchParams(params).toString();

	return {
		params,
		queryString: str ? `?${str}` : "",
	};
}
