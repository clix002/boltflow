import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const PROPERTY_ROW_ALIGN = {
	CENTER: "center",
	START: "start",
} as const;

export type PropertyRowAlign =
	(typeof PROPERTY_ROW_ALIGN)[keyof typeof PROPERTY_ROW_ALIGN];

const taskPropertyRowVariants = cva("grid grid-cols-[120px_1fr] gap-2", {
	variants: {
		align: {
			[PROPERTY_ROW_ALIGN.CENTER]: "items-center",
			[PROPERTY_ROW_ALIGN.START]: "items-start",
		},
	},
	defaultVariants: {
		align: PROPERTY_ROW_ALIGN.CENTER,
	},
});

const taskPropertyLabelVariants = cva(
	"flex items-center gap-2 text-muted-foreground",
	{
		variants: {
			align: {
				[PROPERTY_ROW_ALIGN.CENTER]: "",
				[PROPERTY_ROW_ALIGN.START]: "pt-0.5",
			},
		},
		defaultVariants: {
			align: PROPERTY_ROW_ALIGN.CENTER,
		},
	},
);

type TaskPropertyRowProps = VariantProps<typeof taskPropertyRowVariants> & {
	icon: LucideIcon;
	label: string;
	children: ReactNode;
};

export const TaskPropertyRow = ({
	icon: Icon,
	label,
	align = PROPERTY_ROW_ALIGN.CENTER,
	children,
}: TaskPropertyRowProps) => {
	return (
		<div className={cn(taskPropertyRowVariants({ align }))}>
			<div className={cn(taskPropertyLabelVariants({ align }))}>
				<Icon className="size-3.5" />
				<span>{label}</span>
			</div>
			<div>{children}</div>
		</div>
	);
};
