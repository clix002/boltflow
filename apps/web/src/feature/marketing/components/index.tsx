import { MarketingHeader } from "./marketing-header";

export const Marketing = () => {
	return (
		<div className="flex min-h-svh flex-col bg-background text-foreground">
			<MarketingHeader />
			<main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6">
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">BoltFlow</h1>
					<p className="text-sm text-muted-foreground">
						Marketing page structure ready.
					</p>
				</div>
			</main>
		</div>
	);
};
