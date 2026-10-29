import {
	buildGitHubOwnerAvatarUrl,
	CATALOG_SLUG,
} from "@scrum-board/shared/schemas";
import type { Maybe } from "@scrum-board/shared/types";
import { Upload } from "lucide-react";
import { type ChangeEvent, useRef } from "react";
import { toast } from "sonner";
import { BoltFlowLogo } from "@/components/logo/boltflow-logo";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useGetCatalogQuery } from "@/feature/catalog/api/use-get-catalog";
import { cn } from "@/lib/utils";

const MAX_SVG_FILE_BYTES = 20 * 1024;

type BoardIconPickerProps = {
	value: Maybe<string | undefined>;
	githubRepo: Maybe<string | undefined>;
	onChange: (nextIconUrl: Maybe<string>) => void;
};

export const BoardIconPicker = ({
	value,
	githubRepo,
	onChange,
}: BoardIconPickerProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { data: presets = [] } = useGetCatalogQuery(CATALOG_SLUG.BOARD_ICON);

	const githubAvatarUrl = buildGitHubOwnerAvatarUrl(githubRepo);
	const activeIconUrl = value ?? presets[0]?.value ?? null;

	const handleSvgUpload = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;

		if (
			!file.name.toLowerCase().endsWith(".svg") &&
			file.type !== "image/svg+xml"
		) {
			toast.error("Please select a valid .svg file");
			return;
		}

		if (file.size > MAX_SVG_FILE_BYTES) {
			toast.error("SVG file must be smaller than 20 KB");
			return;
		}

		const rawText = (await file.text()).trim();
		if (!rawText.includes("<svg")) {
			toast.error("Invalid SVG content");
			return;
		}

		const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(rawText)}`;
		onChange(dataUri);
		toast.success("Custom SVG icon loaded");
	};

	return (
		<Field>
			<div className="flex items-center justify-between">
				<FieldLabel className="text-xs">Project Logo / Icon</FieldLabel>
				<Button
					type="button"
					variant="outline"
					size="xs"
					onClick={() => fileInputRef.current?.click()}
					className="h-6 gap-1.5 text-[11px] cursor-pointer"
				>
					<Upload className="size-3" />
					Upload .SVG
				</Button>
				<Input
					ref={fileInputRef}
					type="file"
					accept=".svg,image/svg+xml"
					onChange={handleSvgUpload}
					className="hidden"
				/>
			</div>

			<div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
				<div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border bg-background/80 p-1.5 shadow-xs">
					{activeIconUrl ? (
						<img
							src={activeIconUrl}
							alt="Selected project icon"
							className="size-full rounded-md object-contain"
						/>
					) : (
						<BoltFlowLogo className="size-10" />
					)}
				</div>

				<div className="flex flex-wrap items-center gap-2">
					{presets.map((preset) => {
						const isSelected = activeIconUrl === preset.value;
						return (
							<Button
								key={preset.label}
								type="button"
								variant="ghost"
								size="icon-sm"
								onClick={() => onChange(preset.value)}
								title={preset.label}
								aria-label={preset.label}
								className={cn(
									"size-10 rounded-lg border border-transparent p-1 transition-all cursor-pointer hover:bg-accent",
									isSelected &&
										"border-primary bg-accent ring-2 ring-primary/30",
								)}
							>
								<img
									src={preset.value}
									alt={preset.label}
									className="size-full rounded-sm object-contain"
								/>
							</Button>
						);
					})}

					{githubAvatarUrl && (
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={() => onChange(githubAvatarUrl)}
							title="Use GitHub Repository Owner Logo"
							aria-label="Use GitHub Repository Owner Logo"
							className={cn(
								"size-10 rounded-lg border border-dashed border-border p-1 transition-all cursor-pointer hover:bg-accent",
								activeIconUrl === githubAvatarUrl &&
									"border-solid border-primary bg-accent ring-2 ring-primary/30",
							)}
						>
							<img
								src={githubAvatarUrl}
								alt="GitHub Owner"
								className="size-full rounded-sm object-cover"
							/>
						</Button>
					)}
				</div>
			</div>

			<FieldDescription className="text-[11px]">
				Choose a preset icon, use your GitHub repository avatar, or upload a
				custom .svg logo.
			</FieldDescription>
		</Field>
	);
};
