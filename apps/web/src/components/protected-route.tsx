import { Navigate, useLocation } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";

type ProtectedRouteProps = {
	children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { user } = useAuthStore();
	const location = useLocation();

	if (!user) {
		return (
			<Navigate
				to="/login"
				state={{ from: `${location.pathname}${location.search}` }}
				replace
			/>
		);
	}

	return <>{children}</>;
};
