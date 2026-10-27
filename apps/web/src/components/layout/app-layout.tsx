import { Outlet } from "react-router";
import { Header } from "@/components/header";
import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const AppLayout = () => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="px-4 h-svh overflow-hidden flex flex-col">
				<Header />
				<main className="flex flex-1 flex-col min-h-0 min-w-0 overflow-hidden">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
};
