import type * as React from "react";
import { useMatches } from "react-router";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import type { RouteHandle } from "@/routes";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const matches = useMatches();

	const currentMatch = [...matches].reverse().find((match) => {
		const handle = match.handle as RouteHandle;

		return Boolean(handle?.sidebar);
	});

	const SideComponent = (currentMatch?.handle as RouteHandle)?.sidebar;
	const HeaderComponent = (currentMatch?.handle as RouteHandle)?.sidebarHeader;

	return (
		<Sidebar {...props}>
			<SidebarHeader>{HeaderComponent && <HeaderComponent />}</SidebarHeader>
			<SidebarContent>{SideComponent && <SideComponent />}</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
