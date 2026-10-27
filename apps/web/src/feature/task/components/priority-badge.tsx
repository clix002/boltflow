import type { Priority } from "@scrum-board/shared/schemas";
import { cva } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

export const priorityDotVariants = cva(
	"rounded-full shrink-0 transition-colors",
	{
		variants: {
			priority: {
				LOW: "bg-slate-500 dark:bg-slate-400",
				MEDIUM: "bg-blue-600 dark:bg-blue-400",
				HIGH: "bg-amber-600 dark:bg-amber-400",
				URGENT: "bg-rose-600 dark:bg-rose-400",
			},
			size: {
				xs: "size-1.5",
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
	"inline-flex w-fit shrink-0 items-center gap-1.5 font-medium whitespace-nowrap rounded-md border transition-colors",
	{
		variants: {
			priority: {
				LOW: "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-400",
				MEDIUM:
					"border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
				HIGH: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
				URGENT:
					"border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
			},
			size: {
				sm: "h-5 px-1.5 text-[11px]",
				default: "h-6 px-2 text-xs",
			},
		},
		defaultVariants: {
			priority: "MEDIUM",
			size: "sm",
		},
	},
);

export const priorityLabels: Record<Priority, string> = {
	LOW: "Low",
	MEDIUM: "Medium",
	HIGH: "High",
	URGENT: "Urgent",
};

type BasePriorityBadgeProps = Omit<React.ComponentProps<"span">, "children"> & {
	priority: Priority;
};

export type PriorityBadgeProps = BasePriorityBadgeProps &
	(
		| { variant: "dot"; size?: "sm" | "default" | "lg" }
		| { variant?: "badge"; size?: "sm" | "default" }
	);

export function PriorityBadge({
	priority,
	variant = "badge",
	size = "sm",
	className,
	...props
}: PriorityBadgeProps) {
	const label = priorityLabels[priority];

	if (variant === "dot") {
		return (
			<span
				role="img"
				data-slot="priority-dot"
				data-priority={priority}
				title={`Priority: ${label}`}
				aria-label={`Priority: ${label}`}
				className={cn(priorityDotVariants({ priority, size }), className)}
				{...props}
			/>
		);
	}

	const badgeSize = size === "default" ? "default" : "sm";
	const dotSize = badgeSize === "default" ? "sm" : "xs";

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
			<span
				aria-hidden="true"
				className={priorityDotVariants({ priority, size: dotSize })}
			/>
			<span>{label}</span>
		</span>
	);
}
