import { LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "../theme-provider";
import { themeOptions } from "./util";

type UserAvatarProps = {
	handleLogout: () => void;
};
export const UserAvatar = ({ handleLogout }: UserAvatarProps) => {
	const { user } = useAuthStore();
	const { setTheme } = useTheme();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full">
					<Avatar>
						<AvatarImage src={user?.avatarUrl ?? ""} alt="user" />
						<AvatarFallback>
							{user?.name.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem disabled>
						<h3 className="text-muted-foreground">{user?.name}</h3>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<Separator className="my-1" />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleLogout}>
						<LogOutIcon />
						Log out
					</DropdownMenuItem>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Themes</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							{themeOptions.map(({ key, icon, label }) => (
								<DropdownMenuItem key={key} onClick={() => setTheme(key)}>
									{icon}
									{label}
								</DropdownMenuItem>
							))}
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
