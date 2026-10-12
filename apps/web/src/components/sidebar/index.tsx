import type * as React from "react";
import { useMatches, useNavigate } from "react-router";
import { toast } from "sonner";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useLogoutMutation } from "@/feature/auth/api/use-logout";
import type { RouteHandle } from "@/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { UserAvatar } from "../user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const navigate = useNavigate();
	const { clearUser } = useAuthStore();

	const { mutate: logoutMutation } = useLogoutMutation();

	const matches = useMatches();

	const currentMatch = [...matches].reverse().find((match) => {
		const handle = match.handle as RouteHandle;

		return Boolean(handle?.sidebar);
	});

	const SideComponent = (currentMatch?.handle as RouteHandle)?.sidebar;
	const HeaderComponent = (currentMatch?.handle as RouteHandle)?.sidebarHeader;

	const handleLogout = () => {
		logoutMutation(undefined, {
			onSuccess: () => {
				clearUser();
				navigate("/login");
			},
			onError: (error) => {
				toast.error(error.message || "An error occurred while logging out");
			},
		});
	};

	return (
		<Sidebar {...props}>
			<SidebarHeader>{HeaderComponent && <HeaderComponent />}</SidebarHeader>
			<SidebarContent>{SideComponent && <SideComponent />}</SidebarContent>
			<SidebarFooter>
				<UserAvatar handleLogout={handleLogout} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
