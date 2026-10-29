import { zodResolver } from "@hookform/resolvers/zod";
import {
	BOLT_STATUS,
	type Bolt,
	type BoltStatus,
	BoltStatusSchema,
	CATALOG_SLUG,
	CreateBoltSchema,
} from "@scrum-board/shared/schemas";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBoltMutation } from "@/feature/board/api/use-create-bolt";
import { useUpdateBoltMutation } from "@/feature/board/api/use-update-bolt";
import { useGetCatalogQuery } from "@/feature/catalog/api/use-get-catalog";

type BoltFormDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	boardId: string;
	unitId: string;
	bolt?: Bolt;
};

type FormData = z.infer<typeof CreateBoltSchema>;

function parseBoltStatus(value: string): BoltStatus {
	const parsed = BoltStatusSchema.safeParse(value);
	return parsed.success ? parsed.data : BOLT_STATUS.PLANNED;
}

export const BoltFormDialog = ({
	open,
	onOpenChange,
	boardId,
	unitId,
	bolt,
}: BoltFormDialogProps) => {
	const isEditing = Boolean(bolt);
	const { data: statusOptions = [] } = useGetCatalogQuery(
		CATALOG_SLUG.BOLT_STATUS,
	);
	const { mutate: createBolt, isPending: isCreating } = useCreateBoltMutation();
	const { mutate: updateBolt, isPending: isUpdating } = useUpdateBoltMutation();
	const isPending = isCreating || isUpdating;

	const form = useForm<FormData>({
		resolver: zodResolver(CreateBoltSchema),
		defaultValues: {
			unitId: bolt?.unitId ?? unitId,
			name: bolt?.name ?? "",
			goal: bolt?.goal ?? "",
			status: bolt?.status ?? BOLT_STATUS.PLANNED,
		},
	});

	const onSubmit = (data: FormData) => {
		if (!boardId) return;

		if (bolt) {
			updateBolt(
				{
					boardId,
					boltId: bolt.id,
					data: {
						name: data.name,
						goal: data.goal,
						status: data.status,
					},
				},
				{
					onSuccess: () => {
						onOpenChange(false);
					},
				},
			);
			return;
		}

		createBolt(
			{
				boardId,
				data: {
					unitId,
					name: data.name,
					goal: data.goal,
					status: data.status ?? BOLT_STATUS.PLANNED,
				},
			},
			{
				onSuccess: () => {
					form.reset();
					onOpenChange(false);
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Bolt" : "Create Bolt (Iteration)"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the iteration name, goal, or status."
							: "Define a rapid iteration cycle for your board tasks."}
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mt-4 flex flex-col gap-4"
				>
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Bolt Name</FieldLabel>
								<Input
									{...field}
									id={field.name}
									placeholder="e.g. Bolt #4: CLI & Webhooks"
									aria-invalid={fieldState.invalid}
									autoFocus
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						name="goal"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel htmlFor={field.name}>Iteration Goal</FieldLabel>
								<Textarea
									id={field.name}
									name={field.name}
									ref={field.ref}
									onBlur={field.onBlur}
									value={field.value ?? ""}
									onChange={field.onChange}
									placeholder="What is the primary deliverable of this Bolt?"
									aria-invalid={fieldState.invalid}
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						name="status"
						control={form.control}
						render={({ field }) => (
							<Field>
								<FieldLabel>Status</FieldLabel>
								<Select
									value={field.value ?? BOLT_STATUS.PLANNED}
									onValueChange={(val) => field.onChange(parseBoltStatus(val))}
								>
									<SelectTrigger className="w-full cursor-pointer">
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										{statusOptions.map((option) => (
											<SelectItem
												key={option.value}
												value={option.value}
												className="cursor-pointer"
											>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>
						)}
					/>

					<Button type="submit" disabled={isPending} className="cursor-pointer">
						{isEditing ? "Save Changes" : "Create Bolt"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
