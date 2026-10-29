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
				<main className="relative flex flex-1 flex-col min-h-0 min-w-0 overflow-hidden -mx-4 px-4">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_85%_75%_at_50%_20%,#000_60%,transparent_100%)]"
					/>
					<div className="relative z-10 flex flex-1 flex-col min-h-0 min-w-0 overflow-hidden">
						<Outlet />
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
};
