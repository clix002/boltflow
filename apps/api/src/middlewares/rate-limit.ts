import { getConnInfo } from "@hono/bun";
import type { Maybe } from "@scrum-board/shared/types";
import { isNil, last } from "es-toolkit";
import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

type Bucket = {
	timestamps: number[];
};

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10_000;
const MAX_REQUESTS = 5;
const MAX_BUCKET_CAPACITY = 5_000;

const getSocketIp = (c: Context): Maybe<string> => {
	try {
		const address = getConnInfo(c)?.remote?.address;
		return !isNil(address) ? address : null;
	} catch {
		return null;
	}
};

const getClientKey = (c: Context): string => {
	const realIp = c.req.header("cf-connecting-ip") ?? c.req.header("x-real-ip");
	if (!isNil(realIp) && realIp.trim().length > 0) {
		return realIp.trim();
	}
	const forwarded = c.req.header("x-forwarded-for");
	if (!isNil(forwarded) && forwarded.trim().length > 0) {
		return forwarded.split(",")[0].trim();
	}
	const socketIp = getSocketIp(c);
	if (!isNil(socketIp)) {
		return socketIp;
	}
	return "unknown";
};

const cleanupExpiredTimestamps = (
	timestamps: number[],
	now: number,
): number[] => timestamps.filter((t) => now - t < WINDOW_MS);

const sweepExpiredBuckets = (now: number) => {
	for (const [k, b] of buckets.entries()) {
		const latest = last(b.timestamps);
		if (isNil(latest) || now - latest >= WINDOW_MS) {
			buckets.delete(k);
		}
	}
};

export const rateLimit = async (c: Context, next: Next) => {
	const key = getClientKey(c);
	const now = Date.now();

	if (buckets.size > MAX_BUCKET_CAPACITY) {
		sweepExpiredBuckets(now);
	}

	const bucket = buckets.get(key);
	const timestamps = bucket
		? cleanupExpiredTimestamps(bucket.timestamps, now)
		: [];

	if (timestamps.length >= MAX_REQUESTS) {
		const retryAfter = Math.ceil((WINDOW_MS - (now - timestamps[0])) / 1000);
		c.header("Retry-After", retryAfter.toString());
		throw new HTTPException(429, {
			message: "Too many requests. Please try again later.",
		});
	}

	timestamps.push(now);
	buckets.set(key, { timestamps });

	await next();
};

export const resetRateLimits = () => buckets.clear();
