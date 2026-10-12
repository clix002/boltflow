import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@scrum-board/shared/schemas";
import { useQueryClient } from "@tanstack/react-query";
import { GalleryVerticalEnd } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
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
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useLoginMutation } from "../api/use-login";

type LoginFormValues = z.infer<typeof LoginSchema>;

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { setUser } = useAuthStore();
	const queryClient = useQueryClient();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const { mutate: loginMutation } = useLoginMutation();

	const onSubmit = (data: LoginFormValues) => {
		loginMutation(data, {
			onSuccess: (result) => {
				setUser(result.user);
				queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
			},
			onError: (error) => {
				toast.error(error.message || "An error occurred while logging in");
			},
		});
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<FieldGroup>
					<div className="flex flex-col items-center gap-2 text-center">
						<Link
							to="#"
							className="flex flex-col items-center gap-2 font-medium"
						>
							<div className="flex size-8 items-center justify-center rounded-md">
								<GalleryVerticalEnd className="size-6" />
							</div>
							<span className="sr-only">Scrum-Board</span>
						</Link>
						<h1 className="text-xl font-bold">Welcome to Scrum-Board</h1>
						<FieldDescription>
							Don&apos;t have an account? <Link to="/register">Sign up</Link>
						</FieldDescription>
					</div>
					<Field>
						<FieldLabel htmlFor="email">Email</FieldLabel>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
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
						<FieldLabel htmlFor="password">Password</FieldLabel>
						<Input
							id="password"
							type="password"
							placeholder="********"
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
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Spinner data-icon="inline-start" />
									Logging in...
								</>
							) : (
								"Continue"
							)}
						</Button>
					</Field>
				</FieldGroup>
			</form>
			<FieldDescription className="px-6 text-center">
				By clicking continue, you agree to our{" "}
				<Link to="#">Terms of Service</Link> and{" "}
				<Link to="#">Privacy Policy</Link>.
			</FieldDescription>
		</div>
	);
}
