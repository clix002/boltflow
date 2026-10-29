import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

export const INPUT_VARIANT = {
	DEFAULT: "default",
	GHOST: "ghost",
} as const;

export type InputVariant = (typeof INPUT_VARIANT)[keyof typeof INPUT_VARIANT];

export const inputVariants = cva(
	"w-full min-w-0 bg-transparent transition-colors outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			variant: {
				[INPUT_VARIANT.DEFAULT]:
					"h-8 rounded-lg border border-input px-2.5 py-1 text-base file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
				[INPUT_VARIANT.GHOST]:
					"border-none p-0 shadow-none focus-visible:ring-0",
			},
		},
		defaultVariants: {
			variant: INPUT_VARIANT.DEFAULT,
		},
	},
);

function Input({
	className,
	type,
	variant = INPUT_VARIANT.DEFAULT,
	...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
	return (
		<input
			type={type}
			data-slot="input"
			data-variant={variant}
			className={cn(inputVariants({ variant, className }))}
			{...props}
		/>
	);
}

export { Input };
