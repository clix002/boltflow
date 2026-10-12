import { Link } from "react-router";
import { data } from "@/components/sidebar/util";
import {
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export const BoardSidebar = () => {
	return (
		<>
			{data.navMain.map((item) => (
				<SidebarGroupContent key={item.url}>
					<SidebarMenu>
						{item.items.map((subItem) => (
							<SidebarMenuItem key={subItem.title}>
								<SidebarMenuButton asChild>
									<Link to={subItem.url}>{subItem.title}</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			))}
		</>
	);
};
