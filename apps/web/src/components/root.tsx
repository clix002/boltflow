import type { ReactNode } from "react";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useMe } from "@/feature/auth/api/use-me";
import { useAuthStore } from "@/store/useAuthStore";

export const Root = ({ children }: { children: ReactNode }) => {
	const { user, setUser, clearUser } = useAuthStore();
	const { data, isLoading, isError } = useMe();

	useEffect(() => {
		if (isError) {
			clearUser();
			return;
		}
		if (data?.user) {
			setUser(data.user);
		}
	}, [data, isError, setUser, clearUser]);

	const isSyncingAuthUser = Boolean(data?.user) && !user && !isError;

	if (isLoading || isSyncingAuthUser) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner />
			</div>
		);
	}

	return <>{children}</>;
};
