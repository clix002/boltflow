import { getConnInfo } from "@hono/bun";
import { isNil, last } from "es-toolkit";
import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { env } from "@/config/env";

type Bucket = {
	timestamps: number[];
};

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10_000;
const MAX_REQUESTS = 5;
const MAX_BUCKET_CAPACITY = 5_000;
let lastSweep = 0;

const getSocketIp = (c: Context): string => {
	const address = getConnInfo(c).remote.address;
	if (!address) {
		throw new HTTPException(503, { message: "Client address unavailable" });
	}
	return address;
};

const getClientKey = (c: Context): string => {
	const socketIp = getSocketIp(c);
	if (!env.TRUST_PROXY) return socketIp;

	const forwarded = c.req.header("x-forwarded-for");
	// The trusted proxy appends the rightmost address; earlier hops can be client supplied.
	return forwarded?.split(",").at(-1)?.trim() || socketIp;
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
	const bucket = buckets.get(key);

	if (!bucket && buckets.size >= MAX_BUCKET_CAPACITY) {
		if (now - lastSweep >= WINDOW_MS) {
			sweepExpiredBuckets(now);
			lastSweep = now;
		}
		while (buckets.size >= MAX_BUCKET_CAPACITY) {
			const oldestKey = buckets.keys().next().value;
			if (oldestKey === undefined) break;
			buckets.delete(oldestKey);
		}
	}

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
	buckets.delete(key);
	buckets.set(key, { timestamps });

	await next();
};

export const resetRateLimits = () => {
	buckets.clear();
	lastSweep = 0;
};
