import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { AUTH_PATH } from "@/feature/auth/auth.constants";
import { useAuthStore } from "@/store/useAuthStore";

type ProtectedRouteProps = {
	children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { user } = useAuthStore();
	const location = useLocation();

	if (!user) {
		return (
			<Navigate
				to={AUTH_PATH.LOGIN}
				state={{ from: `${location.pathname}${location.search}` }}
				replace
			/>
		);
	}

	return <>{children}</>;
};
