import type { Maybe } from "@scrum-board/shared/types";
import { createContext, useContext, useEffect, useState } from "react";

export const THEME = {
	DARK: "dark",
	LIGHT: "light",
	SYSTEM: "system",
} as const;

export type Theme = (typeof THEME)[keyof typeof THEME];

export const RESOLVED_THEME = {
	DARK: THEME.DARK,
	LIGHT: THEME.LIGHT,
} as const;

export type ResolvedTheme =
	(typeof RESOLVED_THEME)[keyof typeof RESOLVED_THEME];

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
	theme: THEME.SYSTEM,
	setTheme: () => null,
};

function isValidTheme(value: Maybe<string>): value is Theme {
	return (
		value === THEME.DARK || value === THEME.LIGHT || value === THEME.SYSTEM
	);
}

export function resolveTheme(theme: Theme): ResolvedTheme {
	if (theme !== THEME.SYSTEM) {
		return theme;
	}
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? RESOLVED_THEME.DARK
		: RESOLVED_THEME.LIGHT;
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = THEME.SYSTEM,
	storageKey = "vite-ui-theme",
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(() => {
		const stored = localStorage.getItem(storageKey);
		return isValidTheme(stored) ? stored : defaultTheme;
	});

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove(THEME.LIGHT, THEME.DARK);
		root.classList.add(resolveTheme(theme));
	}, [theme]);

	const value = {
		theme,
		setTheme: (nextTheme: Theme) => {
			localStorage.setItem(storageKey, nextTheme);
			setTheme(nextTheme);
		},
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined)
		throw new Error("useTheme must be used within a ThemeProvider");

	return context;
};
