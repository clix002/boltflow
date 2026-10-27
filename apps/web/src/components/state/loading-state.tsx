import { Spinner } from "@/components/ui/spinner";

export const LoadingState = () => (
	<div className="flex flex-1 items-center justify-center">
		<Spinner className="size-8 text-primary" />
	</div>
);
