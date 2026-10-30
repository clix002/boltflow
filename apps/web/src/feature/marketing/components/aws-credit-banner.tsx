import { ArrowUpRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AWS_AIDLC_URL } from "./marketing.constants";

export const AwsCreditBanner = () => (
	<aside className="flex flex-col gap-5 border-t border-border/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
		<div className="flex max-w-2xl items-start gap-4">
			<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
				<BookOpen className="size-5" />
			</div>
			<div>
				<h3 className="text-sm font-semibold">Inspired by AWS AI-DLC</h3>
				<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
					Units of Work, Bolts, Mob Elaboration, and Mob Construction come from
					the AI-Driven Development Lifecycle published by AWS.
				</p>
			</div>
		</div>
		<Button
			variant="link"
			size="sm"
			className="w-fit shrink-0 gap-1 px-0"
			asChild
		>
			<a href={AWS_AIDLC_URL} target="_blank" rel="noreferrer">
				Read the AWS article
				<ArrowUpRight className="size-4" />
			</a>
		</Button>
	</aside>
);
