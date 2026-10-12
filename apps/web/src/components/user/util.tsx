import { Monitor, Moon, Sun } from "lucide-react";

export const themeOptions = [
	{ key: "light" as const, icon: <Sun />, label: "Light" },
	{ key: "dark" as const, icon: <Moon />, label: "Dark" },
	{ key: "system" as const, icon: <Monitor />, label: "System" },
];
