import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@scrum-board/shared/schemas";
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
import { useRegisterMutation } from "../api/use-register";

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export const RegisterForm = () => {
	const { setUser } = useAuthStore();
	const queryClient = useQueryClient();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
	});
	const { mutate: createAccount, isPending } = useRegisterMutation();

	const onSubmit = (data: RegisterFormValues) => {
		createAccount(data, {
			onSuccess: (result) => {
				setUser(result.user);
				queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
			},
			onError: (error) => {
				toast.error(
					error.message || "Could not create your account. Please try again.",
				);
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldGroup className="gap-4">
				<Field>
					<FieldLabel htmlFor="register-name">Name</FieldLabel>
					<Input
						id="register-name"
						autoComplete="name"
						placeholder="Your name"
						required
						{...register("name")}
					/>
					{errors.name && (
						<FieldDescription className="text-destructive">
							{errors.name.message}
						</FieldDescription>
					)}
				</Field>
				<Field>
					<FieldLabel htmlFor="register-email">Email</FieldLabel>
					<Input
						id="register-email"
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
					<FieldLabel htmlFor="register-password">Password</FieldLabel>
					<Input
						id="register-password"
						type="password"
						autoComplete="new-password"
						required
						{...register("password")}
					/>
					{errors.password && (
						<FieldDescription className="text-destructive">
							{errors.password.message}
						</FieldDescription>
					)}
				</Field>
				<Field>
					<FieldLabel htmlFor="register-confirm-password">
						Confirm password
					</FieldLabel>
					<Input
						id="register-confirm-password"
						type="password"
						autoComplete="new-password"
						required
						{...register("confirmPassword")}
					/>
					{errors.confirmPassword && (
						<FieldDescription className="text-destructive">
							{errors.confirmPassword.message}
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
					{isPending ? "Creating account..." : "Create account"}
				</Button>
			</FieldGroup>
		</form>
	);
};
