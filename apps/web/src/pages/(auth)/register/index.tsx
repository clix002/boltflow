import { Navigate } from "react-router";
import { RegisterForm } from "@/feature/auth/components/register-form";
import { useAuthStore } from "@/store/useAuthStore";

export const RegisterPage = () => {
	const { user } = useAuthStore();

	if (user) {
		return <Navigate to="/boards" replace />;
	}

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className="w-full max-w-sm">
				<RegisterForm />
			</div>
		</div>
	);
};
