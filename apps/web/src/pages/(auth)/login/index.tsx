import type { Maybe } from "@scrum-board/shared/types";
import { Navigate, useLocation } from "react-router";
import { LoginForm } from "@/feature/auth/components/login-form";
import { useAuthStore } from "@/store/useAuthStore";

type LoginLocationState = Maybe<{
	from?: string;
}>;

export const LoginPage = () => {
	const { user } = useAuthStore();
	const location = useLocation();
	const state = location.state as LoginLocationState;

	if (user) {
		const from = state?.from ?? "/boards";
		return <Navigate to={from} replace />;
	}

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className="w-full max-w-sm">
				<LoginForm />
			</div>
		</div>
	);
};
