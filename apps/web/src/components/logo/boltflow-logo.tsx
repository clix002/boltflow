import type * as React from "react";
import { cn } from "@/lib/utils";

type BoltFlowLogoProps = React.ComponentProps<"svg">;

export const BoltFlowLogo = ({ className, ...props }: BoltFlowLogoProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 256 256"
			fill="none"
			aria-hidden="true"
			className={cn("size-6 shrink-0", className)}
			{...props}
		>
			<polygon points="128,20 221.5,74 128,128 34.5,74" fill="#E4E4E7" />
			<polygon points="34.5,74 128,128 128,236 34.5,182" fill="#71717A" />
			<polygon points="128,128 221.5,74 221.5,182 128,236" fill="#27272A" />

			<polygon points="128,52 128,128 62.2,166 62.2,90" fill="#141417" />
			<polygon points="128,52 193.8,90 193.8,166 128,128" fill="#232329" />
			<polygon points="62.2,166 128,128 193.8,166 128,204" fill="#09090B" />

			<polygon points="128,52 136,56.6 140,122 132,122" fill="#A1A1AA" />
			<polygon points="174,122 182,126.6 128,204 174,122" fill="#71717A" />
			<polygon points="82,134 90,138.6 124,138.6 124,134" fill="#52525B" />

			<polygon
				points="128,52 82,134 124,134 128,204 174,122 132,122"
				fill="#E4E4E7"
			/>
			<polygon points="128,52 82,134 128,128 132,122" fill="#FFFFFF" />
		</svg>
	);
};
