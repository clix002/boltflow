import { Outlet } from "react-router";
import { Header } from "@/components/header";
import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const AppLayout = () => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="px-4">
				<Header />
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
};
