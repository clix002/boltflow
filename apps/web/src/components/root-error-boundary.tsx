import { useRouteError } from "react-router";
import { ErrorState } from "@/components/state/error-state";

export const RootErrorBoundary = () => {
	const error = useRouteError();

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<ErrorState
				title="Application Error"
				description={
					error instanceof Error
						? error.message
						: "An unexpected error occurred. Please try again."
				}
				onRetry={() => window.location.reload()}
				retryText="Reload Page"
			/>
		</div>
	);
};
