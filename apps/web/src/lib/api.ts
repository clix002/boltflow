const BASE_URL = import.meta.env.VITE_API_URL;

class ApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
	if (!refreshPromise) {
		refreshPromise = (async () => {
			try {
				const res = await fetch(`${BASE_URL}/auth/refresh`, {
					method: "POST",
					credentials: "include",
				});
				return res.ok;
			} finally {
				// small delay to avoid race conditions on rapid retries
				setTimeout(() => {
					refreshPromise = null;
				}, 100);
			}
		})();
	}
	return refreshPromise;
}

type Json =
	| Record<string, unknown>
	| unknown[]
	| string
	| number
	| boolean
	| null;

type ApiOptions = {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	body?: Json;
};

async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
	const { method = "GET", body } = options;

	const doFetch = () =>
		fetch(`${BASE_URL}${path}`, {
			method,
			credentials: "include",
			headers: body ? { "Content-Type": "application/json" } : undefined,
			body: body ? JSON.stringify(body) : undefined,
		});

	let res = await doFetch();

	if (
		res.status === 401 &&
		path !== "/auth/refresh" &&
		path !== "/auth/login"
	) {
		const refreshed = await tryRefresh();
		if (refreshed) {
			res = await doFetch();
		}
	}

	if (!res.ok) {
		const errorData = await res.json().catch(() => ({}));
		throw new ApiError(errorData.message ?? res.statusText, res.status);
	}

	if (res.status === 204) {
		return undefined as T;
	}

	return (await res.json()) as T;
}

export const api = {
	get: <T>(path: string) => apiFetch<T>(path, { method: "GET" }),
	post: <T>(path: string, body?: Json) =>
		apiFetch<T>(path, { method: "POST", body }),
	put: <T>(path: string, body?: Json) =>
		apiFetch<T>(path, { method: "PUT", body }),
	patch: <T>(path: string, body?: Json) =>
		apiFetch<T>(path, { method: "PATCH", body }),
	del: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};

export { ApiError };
