import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { BoltFlowLogo } from "@/components/logo/boltflow-logo";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/useAuthStore";
import { AUTH_PATH } from "../../auth.constants";
import { LoginForm } from "../login-form";
import { RegisterForm } from "../register-form";

export const AuthDialog = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const isLogin = location.pathname === AUTH_PATH.LOGIN;
	const isRegister = location.pathname === AUTH_PATH.REGISTER;
	const requestedPath = location.state?.from;
	const destination =
		typeof requestedPath === "string" &&
		requestedPath.startsWith("/") &&
		!requestedPath.startsWith("//")
			? requestedPath
			: AUTH_PATH.BOARDS;

	if (!isLogin && !isRegister) return null;
	if (user) return <Navigate to={destination} replace />;

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) navigate(AUTH_PATH.HOME, { replace: true });
			}}
		>
			<DialogContent className="max-h-[calc(100svh-2rem)] gap-4 overflow-y-auto p-5 sm:max-w-md sm:p-7">
				<DialogHeader className="items-center gap-2 text-center">
					<div className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-tight">
						<BoltFlowLogo className="size-6" />
						<span>BoltFlow</span>
					</div>
					<DialogTitle className="text-2xl font-semibold tracking-tight">
						{isLogin ? "Welcome back" : "Create your account"}
					</DialogTitle>
					<DialogDescription>
						{isLogin
							? "Sign in to continue with BoltFlow."
							: "Create an account to organize your work in BoltFlow."}
					</DialogDescription>
				</DialogHeader>
				{isLogin ? <LoginForm /> : <RegisterForm />}
				<p className="text-center text-sm text-muted-foreground">
					{isLogin ? "New to BoltFlow?" : "Already have an account?"}{" "}
					<Link
						to={isLogin ? AUTH_PATH.REGISTER : AUTH_PATH.LOGIN}
						state={location.state}
						className="font-medium text-foreground underline decoration-primary/50 underline-offset-4 hover:text-primary"
					>
						{isLogin ? "Create an account" : "Sign in"}
					</Link>
				</p>
			</DialogContent>
		</Dialog>
	);
};
