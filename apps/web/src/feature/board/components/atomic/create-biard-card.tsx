import { Plus } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

type CreateBoardCardProps = {
	onclick?: () => void;
};

export const CreateBoardCard = ({ onclick }: CreateBoardCardProps) => {
	return (
		<Card
			className="min-h-40 cursor-pointer border-2 border-dashed border-muted-foreground/35 bg-card/40 backdrop-blur-xs transition-all hover:border-primary/60 hover:bg-card/70"
			onClick={onclick}
		>
			<CardDescription className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
				<div className="flex size-10 items-center justify-center rounded-xl border border-border/80 bg-muted/50 text-foreground transition-transform duration-200 group-hover/card:scale-105">
					<Plus className="size-5" />
				</div>
				<CardTitle className="select-none text-base">Create Board</CardTitle>
				<span className="select-none text-xs text-muted-foreground">
					Link a GitHub repository & launch AI-DLC units
				</span>
			</CardDescription>
		</Card>
	);
};
