import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const SHEET_SIDE = {
	TOP: "top",
	RIGHT: "right",
	BOTTOM: "bottom",
	LEFT: "left",
} as const;

export type SheetSide = (typeof SHEET_SIDE)[keyof typeof SHEET_SIDE];

export const SHEET_SIZE = {
	SM: "sm",
	DEFAULT: "default",
	EXPANDED: "expanded",
} as const;

export type SheetSize = (typeof SHEET_SIZE)[keyof typeof SHEET_SIZE];

const sheetOverlayVariants = cva(
	"fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
	{
		variants: {
			insetSidebar: {
				true: "md:left-64",
				false: "",
			},
		},
		defaultVariants: {
			insetSidebar: false,
		},
	},
);

const sheetContentVariants = cva(
	"fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition-[width,max-width,transform] duration-300 ease-in-out data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
	{
		variants: {
			side: {
				[SHEET_SIDE.TOP]:
					"inset-x-0 top-0 h-auto border-b data-open:slide-in-from-top-10 data-closed:slide-out-to-top-10",
				[SHEET_SIDE.BOTTOM]:
					"inset-x-0 bottom-0 h-auto border-t data-open:slide-in-from-bottom-10 data-closed:slide-out-to-bottom-10",
				[SHEET_SIDE.LEFT]:
					"inset-y-0 left-0 h-full border-r data-open:slide-in-from-left-10 data-closed:slide-out-to-left-10",
				[SHEET_SIDE.RIGHT]:
					"inset-y-0 right-0 h-full border-l data-open:slide-in-from-right-10 data-closed:slide-out-to-right-10",
			},
			size: {
				[SHEET_SIZE.SM]:
					"data-[side=left]:w-3/4 data-[side=right]:w-3/4 data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
				[SHEET_SIZE.DEFAULT]:
					"data-[side=left]:w-full data-[side=right]:w-full data-[side=left]:max-w-none data-[side=right]:max-w-none data-[side=left]:md:w-1/2 data-[side=right]:md:w-1/2",
				[SHEET_SIZE.EXPANDED]:
					"data-[side=left]:w-full data-[side=right]:w-full data-[side=left]:max-w-none data-[side=right]:max-w-none",
			},
			insetSidebar: {
				true: "",
				false: "",
			},
		},
		compoundVariants: [
			{
				size: SHEET_SIZE.DEFAULT,
				insetSidebar: true,
				className: "data-[side=right]:md:w-[calc((100vw-16rem)/2)]",
			},
			{
				size: SHEET_SIZE.EXPANDED,
				insetSidebar: true,
				className: "data-[side=right]:md:w-[calc(100vw-16rem)]",
			},
			{
				size: SHEET_SIZE.EXPANDED,
				insetSidebar: false,
				className: "data-[side=right]:md:w-screen data-[side=right]:border-l-0",
			},
		],
		defaultVariants: {
			side: SHEET_SIDE.RIGHT,
			size: SHEET_SIZE.SM,
			insetSidebar: false,
		},
	},
);

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
	return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
	return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
	return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
	return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
	className,
	insetSidebar = false,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay> &
	VariantProps<typeof sheetOverlayVariants>) {
	return (
		<SheetPrimitive.Overlay
			data-slot="sheet-overlay"
			className={cn(sheetOverlayVariants({ insetSidebar, className }))}
			{...props}
		/>
	);
}

function SheetContent({
	className,
	children,
	side = SHEET_SIDE.RIGHT,
	size = SHEET_SIZE.SM,
	insetSidebar = false,
	showCloseButton = true,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Content> &
	VariantProps<typeof sheetContentVariants> & {
		showCloseButton?: boolean;
	}) {
	return (
		<SheetPortal>
			<SheetOverlay insetSidebar={insetSidebar} />
			<SheetPrimitive.Content
				data-slot="sheet-content"
				data-side={side}
				data-size={size}
				className={cn(
					sheetContentVariants({ side, size, insetSidebar, className }),
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<SheetPrimitive.Close data-slot="sheet-close" asChild>
						<Button
							variant="ghost"
							className="absolute top-3 right-3"
							size="icon-sm"
						>
							<XIcon />
							<span className="sr-only">Close</span>
						</Button>
					</SheetPrimitive.Close>
				)}
			</SheetPrimitive.Content>
		</SheetPortal>
	);
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sheet-header"
			className={cn("flex flex-col gap-0.5 p-4", className)}
			{...props}
		/>
	);
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sheet-footer"
			className={cn("mt-auto flex flex-col gap-2 p-4", className)}
			{...props}
		/>
	);
}

function SheetTitle({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
	return (
		<SheetPrimitive.Title
			data-slot="sheet-title"
			className={cn(
				"font-heading text-base font-medium text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function SheetDescription({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
	return (
		<SheetPrimitive.Description
			data-slot="sheet-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

export {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	sheetContentVariants,
};
