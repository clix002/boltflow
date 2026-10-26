import type { Priority } from "@scrum-board/shared/schemas";
import { cva } from "class-variance-authority";
import { cn } from "cn";
import { AlertCircle, ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import type * as React from "react";

export const priorityDotVariants = cva(
	"rounded-full shrink-0 transition-colors",
	{
		variants: {
			priority: {
				LOW: "bg-slate-400 dark:bg-slate-500",
				MEDIUM: "bg-blue-500",
				HIGH: "bg-amber-500",
				URGENT: "bg-rose-500",
			},
			size: {
				sm: "size-2",
				default: "size-2.5",
				lg: "size-3",
			},
		},
		defaultVariants: {
			priority: "MEDIUM",
			size: "sm",
		},
	},
);

export const priorityBadgeVariants = cva(
	"inline-flex w-fit shrink-0 items-center gap-1 font-medium whitespace-nowrap rounded-md border transition-colors",
	{
		variants: {
			priority: {
				LOW: "border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400",
				MEDIUM:
					"border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
				HIGH: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
				URGENT:
					"border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
			},
			size: {
				sm: "h-5 px-1.5 text-[11px] [&>svg]:size-3",
				default: "h-6 px-2 text-xs [&>svg]:size-3.5",
			},
		},
		defaultVariants: {
			priority: "MEDIUM",
			size: "sm",
		},
	},
);

const priorityIcons = {
	LOW: ArrowDown,
	MEDIUM: ArrowRight,
	HIGH: ArrowUp,
	URGENT: AlertCircle,
} as const;

export const priorityLabels: Record<Priority, string> = {
	LOW: "Low",
	MEDIUM: "Medium",
	HIGH: "High",
	URGENT: "Urgent",
};

export type PriorityBadgeProps = React.ComponentProps<"span"> & {
	priority: Priority;
	variant?: "dot" | "badge";
	size?: "sm" | "default" | "lg";
	showIcon?: boolean;
	showLabel?: boolean;
};

export function PriorityBadge({
	priority,
	variant = "badge",
	size = "sm",
	showIcon = true,
	showLabel = true,
	className,
	...props
}: PriorityBadgeProps) {
	const label = priorityLabels[priority];

	if (variant === "dot") {
		const dotSize =
			size === "lg" ? "lg" : size === "default" ? "default" : "sm";
		return (
			<span
				role="status"
				data-slot="priority-dot"
				data-priority={priority}
				title={`Priority: ${label}`}
				aria-label={`Priority: ${label}`}
				className={cn(
					priorityDotVariants({ priority, size: dotSize }),
					className,
				)}
				{...props}
			/>
		);
	}

	const badgeSize = size === "default" || size === "lg" ? "default" : "sm";
	const Icon = priorityIcons[priority];

	return (
		<span
			data-slot="priority-badge"
			data-priority={priority}
			className={cn(
				priorityBadgeVariants({ priority, size: badgeSize }),
				className,
			)}
			{...props}
		>
			{showIcon && <Icon className="shrink-0" />}
			{showLabel && <span>{label}</span>}
		</span>
	);
}
