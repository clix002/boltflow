import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

type ErrorStateProps = {
	title?: string;
	description?: string;
	onRetry?: () => void;
	retryText?: string;
};

export const ErrorState = ({
	title = "Something went wrong",
	description = "An unexpected error occurred. Please try again.",
	onRetry,
	retryText = "Try again",
}: ErrorStateProps) => {
	return (
		<Empty className="flex-1">
			<EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
				<AlertCircle />
			</EmptyMedia>
			<EmptyHeader>
				<EmptyTitle className="text-destructive">{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
			{onRetry && (
				<EmptyContent>
					<Button variant="outline" size="sm" onClick={onRetry}>
						{retryText}
					</Button>
				</EmptyContent>
			)}
		</Empty>
	);
};
