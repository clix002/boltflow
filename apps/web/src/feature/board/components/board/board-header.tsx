import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
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
			<Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Search boards..."
				className="h-8 max-w-xs"
			/>
			<UserAvatar handleLogout={handleLogout} />
		</div>
	);
};
