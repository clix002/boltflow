import { clamp } from "es-toolkit";

export const SIDEBAR_WIDTH_STORAGE_KEY = "sb:sidebar-width";
export const SIDEBAR_WIDTH_DEFAULT = 288;
export const SIDEBAR_WIDTH_MIN = 220;
export const SIDEBAR_WIDTH_MAX = 440;
export const SIDEBAR_DRAG_THRESHOLD_PX = 4;

export const clampSidebarWidth = (width: number): number => {
	return clamp(Math.round(width), SIDEBAR_WIDTH_MIN, SIDEBAR_WIDTH_MAX);
};

export const readPersistedSidebarWidth = (): number => {
	if (typeof window === "undefined") {
		return SIDEBAR_WIDTH_DEFAULT;
	}
	const raw = window.localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
	if (!raw) {
		return SIDEBAR_WIDTH_DEFAULT;
	}
	const parsed = Number(raw);
	if (!Number.isFinite(parsed)) {
		return SIDEBAR_WIDTH_DEFAULT;
	}
	return clampSidebarWidth(parsed);
};

export const persistSidebarWidth = (width: number): void => {
	if (typeof window === "undefined") {
		return;
	}
	window.localStorage.setItem(
		SIDEBAR_WIDTH_STORAGE_KEY,
		String(clampSidebarWidth(width)),
	);
};
