import { BoltFlowLogo } from "@/components/logo/boltflow-logo";

export const BoardSidebarHeader = () => {
	return (
		<div className="flex items-center gap-2.5 px-2 py-1">
			<BoltFlowLogo className="size-6" />
			<h2 className="text-base font-semibold tracking-tight">BoltFlow</h2>
		</div>
	);
};
