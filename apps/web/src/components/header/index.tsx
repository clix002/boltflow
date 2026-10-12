import { useMatches } from "react-router";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { RouteHandle } from "@/routes";

export const Header = () => {
	const matches = useMatches();
	const currentMatch = [...matches].reverse().find((m) => {
		return Boolean((m.handle as RouteHandle)?.headerContent);
	});
	const HeaderContent = (currentMatch?.handle as RouteHandle)?.headerContent;
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b">
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 h-4 self-center!" />
			{HeaderContent && <HeaderContent />}
		</header>
	);
};
