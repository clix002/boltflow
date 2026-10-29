import { Search } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { BoltFlowLogo } from "@/components/logo/boltflow-logo";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user";
import { useLogoutMutation } from "@/feature/auth/api/use-logout";
import {
	SEARCH_DEBOUNCE_MS,
	useDebouncedSearchParam,
} from "@/hooks/use-debounced-search-param";
import { useAuthStore } from "@/store/useAuthStore";

export const BoardHeader = () => {
	const navigate = useNavigate();
	const { clearUser } = useAuthStore();
	const { mutate: logoutMutation } = useLogoutMutation();

	const { value, setValue } = useDebouncedSearchParam(
		"q",
		SEARCH_DEBOUNCE_MS,
		true,
	);

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
		<div className="flex items-center justify-between gap-4 w-full">
			<div className="flex items-center gap-4 min-w-0 flex-1">
				<div className="flex items-center gap-2.5 shrink-0">
					<BoltFlowLogo className="size-7" />
					<span className="font-semibold text-base tracking-tight">
						BoltFlow
					</span>
				</div>
				<Separator orientation="vertical" className="h-5 self-center!" />
				<div className="relative w-full max-w-xs">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder="Search workspaces & boards..."
						className="h-8 pl-8"
					/>
				</div>
			</div>
			<UserAvatar handleLogout={handleLogout} />
		</div>
	);
};
