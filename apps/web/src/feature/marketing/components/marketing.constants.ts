import { Bot, GitBranch, Layers, type LucideIcon, Zap } from "lucide-react";

export const AWS_AIDLC_URL =
	"https://aws.amazon.com/es/blogs/aws-spanish/ciclo-de-vida-de-desarrollo-impulsado-por-ia-reinventando-la-ingenieria-de-software/" as const;

export const GITHUB_PROJECT_URL =
	"https://github.com/clix002/boltflow" as const;

export const GITHUB_PROFILE_URL = "https://github.com/clix002" as const;

export const PILLAR_TONE = {
	INDIGO: "indigo",
	AMBER: "amber",
	EMERALD: "emerald",
	SKY: "sky",
} as const;

export type PillarTone = (typeof PILLAR_TONE)[keyof typeof PILLAR_TONE];

export type AidlcPillarItem = {
	icon: LucideIcon;
	badge: string;
	title: string;
	description: string;
	tone: PillarTone;
};

export const AIDLC_PILLARS = [
	{
		icon: Layers,
		badge: "Organize",
		title: "Organize work by Unit",
		description:
			"Give each Unit of Work its own Kanban board, so a large project stays readable.",
		tone: PILLAR_TONE.INDIGO,
	},
	{
		icon: Zap,
		badge: "Focus",
		title: "Focus on the next Bolt",
		description:
			"Group tasks into short iterations and keep the current goal visible.",
		tone: PILLAR_TONE.AMBER,
	},
	{
		icon: GitBranch,
		badge: "Connect",
		title: "Keep GitHub in context",
		description:
			"See the GitHub branch alongside the Unit or task it belongs to.",
		tone: PILLAR_TONE.EMERALD,
	},
	{
		icon: Bot,
		badge: "Collaborate",
		title: "Share clear ownership",
		description:
			"Show who owns each task and what is ready for review, whether people or AI agents are involved.",
		tone: PILLAR_TONE.SKY,
	},
] as const satisfies readonly AidlcPillarItem[];

export type HeroPreviewColumn = {
	title: string;
	count: number;
	dotClass: string;
	taskTitle: string;
	taskDescription: string;
	boltLabel: string;
	branchLabel: string;
	showFooterDate?: boolean;
};

export const HERO_PREVIEW_COLUMNS = [
	{
		title: "3. Constructing",
		count: 1,
		dotClass: "bg-rose-500",
		taskTitle: "Refine board structure",
		taskDescription: "Give each Unit its own columns and short iterations.",
		boltLabel: "Bolt #2: Unit Sub-Boar...",
		branchLabel: "feature/unit-subboar...",
		showFooterDate: true,
	},
	{
		title: "4. PR Review",
		count: 1,
		dotClass: "bg-amber-500",
		taskTitle: "GitHub Actions pipeline",
		taskDescription: "Review the CI workflow before merging.",
		boltLabel: "Bolt #2: Unit Sub-Boar...",
		branchLabel: "feature/model-01",
		showFooterDate: true,
	},
	{
		title: "5. Merged",
		count: 2,
		dotClass: "bg-amber-500",
		taskTitle: "Shared catalog module",
		taskDescription: "Keep shared options and visual assets in one place.",
		boltLabel: "Bolt #2: Unit Sub-Boar...",
		branchLabel: "feature/unit-subboar...",
		showFooterDate: false,
	},
] as const satisfies readonly HeroPreviewColumn[];

export const HERO_PREVIEW_UNITS = [
	{
		name: "Core & Schema",
		branch: "feature/unit-subboard-01",
		isActive: true,
	},
	{
		name: "CLI Agent",
		branch: "clinton/board-02",
		isActive: false,
	},
	{
		name: "GitHub Sync",
		branch: "feature/board-detail-03",
		isActive: false,
	},
] as const;
