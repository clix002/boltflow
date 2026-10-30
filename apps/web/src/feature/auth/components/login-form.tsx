import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@scrum-board/shared/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ME_QUERY_KEY } from "@/feature/auth/api/use-me";
import { useAuthStore } from "@/store/useAuthStore";
import { useLoginMutation } from "../api/use-login";

type LoginFormValues = z.infer<typeof LoginSchema>;

export const LoginForm = () => {
	const { setUser } = useAuthStore();
	const queryClient = useQueryClient();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(LoginSchema),
		defaultValues: { email: "", password: "" },
	});
	const { mutate: login, isPending } = useLoginMutation();

	const onSubmit = (data: LoginFormValues) => {
		login(data, {
			onSuccess: (result) => {
				setUser(result.user);
				queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
			},
			onError: (error) => {
				toast.error(error.message || "Could not sign in. Please try again.");
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="login-email">Email</FieldLabel>
					<Input
						id="login-email"
						type="email"
						autoComplete="email"
						placeholder="you@example.com"
						required
						{...register("email")}
					/>
					{errors.email && (
						<FieldDescription className="text-destructive">
							{errors.email.message}
						</FieldDescription>
					)}
				</Field>
				<Field>
					<FieldLabel htmlFor="login-password">Password</FieldLabel>
					<Input
						id="login-password"
						type="password"
						autoComplete="current-password"
						required
						{...register("password")}
					/>
					{errors.password && (
						<FieldDescription className="text-destructive">
							{errors.password.message}
						</FieldDescription>
					)}
				</Field>
				<Button
					type="submit"
					size="lg"
					className="mt-1 w-full"
					disabled={isPending}
				>
					{isPending && <Spinner data-icon="inline-start" />}
					{isPending ? "Signing in..." : "Sign in"}
				</Button>
			</FieldGroup>
		</form>
	);
};
