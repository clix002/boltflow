import { isEmpty } from "es-toolkit/compat";
import { Bookmark, Filter, Search, X } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { useParams } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useGetBoardQuery } from "@/feature/board/api/use-get-board";
import { useBoardPreferences } from "@/feature/board/components/board-detail/use-board-preferences";
import { useGetUsersQuery } from "@/feature/user/api/use-get-users";
import { cn } from "@/lib/utils";

export const BoardFilter = () => {
	const { boardId } = useParams<{ boardId: string }>();
	const { data: users } = useGetUsersQuery();

	const [userSearch, setUserSearch] = useState("");

	const {
		session,
		selectedColumnIds,
		selectedUserIds,
		isModified,
		toggleColumn,
		toggleUser,
		clearColumns,
		clearUsers,
		clearAll,
		savePreferences,
	} = useBoardPreferences();

	const deferredSearch = useDeferredValue(session.search);

	const { data: board } = useGetBoardQuery(boardId, {
		search: deferredSearch,
		assigneeIds: session.assigneeIds.join(","),
	});

	const columns = board?.columns ?? [];

	const totalActiveFilters = selectedColumnIds.length + selectedUserIds.length;
	const hasActiveFilters = totalActiveFilters > 0;

	const filteredUsers =
		users?.filter((u) =>
			u.name.toLowerCase().includes(userSearch.toLowerCase().trim()),
		) ?? [];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant={
						isModified ? "outline" : hasActiveFilters ? "secondary" : "outline"
					}
					size="sm"
					className={cn(
						"h-8 gap-1.5 rounded-full px-3 text-xs cursor-pointer relative",
						isModified &&
							"border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 hover:text-amber-700 dark:hover:text-amber-300",
					)}
				>
					<Filter className="size-3.5" />
					<span>Filter</span>
					{hasActiveFilters && (
						<span
							className={cn(
								"flex size-4 items-center justify-center rounded-full text-[10px] font-medium",
								isModified
									? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
									: "bg-primary text-primary-foreground",
							)}
						>
							{totalActiveFilters}
						</span>
					)}
					{isModified && (
						<span className="size-1.5 rounded-full bg-amber-500" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64 p-2">
				<div className="flex items-center justify-between px-1 py-1">
					<span className="text-xs font-semibold">Filter by</span>
					<div className="flex items-center gap-2">
						{isModified && (
							<button
								type="button"
								onClick={savePreferences}
								className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
								title="Save current filters as default"
							>
								<Bookmark className="size-3" />
								Save
							</button>
						)}
						{hasActiveFilters && (
							<button
								type="button"
								onClick={clearAll}
								className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1 transition-colors"
							>
								<X className="size-3" />
								Clear all
							</button>
						)}
					</div>
				</div>
				<DropdownMenuSeparator className="my-1.5" />

				{!isEmpty(columns) && (
					<DropdownMenuGroup>
						<div className="flex items-center justify-between px-1 py-1">
							<div className="flex items-center gap-1.5">
								<span className="text-[11px] font-medium text-muted-foreground">
									Columns
								</span>
								{!isEmpty(selectedColumnIds) && (
									<span className="flex size-3.5 items-center justify-center rounded-full bg-primary/20 text-[9px] font-semibold text-primary">
										{selectedColumnIds.length}
									</span>
								)}
							</div>
							{!isEmpty(selectedColumnIds) && (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										clearColumns();
									}}
									className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
								>
									Clear
								</button>
							)}
						</div>
						<div className="max-h-36 overflow-y-auto custom-scrollbar space-y-0.5 pr-0.5">
							{columns.map((column) => {
								const isSelected = selectedColumnIds.includes(column.id);

								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										checked={isSelected}
										onSelect={(e) => e.preventDefault()}
										onCheckedChange={() => toggleColumn(column.id)}
										className="cursor-pointer text-xs"
									>
										<span className="truncate">{column.name}</span>
									</DropdownMenuCheckboxItem>
								);
							})}
						</div>
					</DropdownMenuGroup>
				)}

				{!isEmpty(columns) && !isEmpty(users) && (
					<DropdownMenuSeparator className="my-1.5" />
				)}

				{!isEmpty(users) && (
					<DropdownMenuGroup>
						<div className="flex items-center justify-between px-1 py-1">
							<div className="flex items-center gap-1.5">
								<span className="text-[11px] font-medium text-muted-foreground">
									Assignees
								</span>
								{!isEmpty(selectedUserIds) && (
									<span className="flex size-3.5 items-center justify-center rounded-full bg-primary/20 text-[9px] font-semibold text-primary">
										{selectedUserIds.length}
									</span>
								)}
							</div>
							{!isEmpty(selectedUserIds) && (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										clearUsers();
									}}
									className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
								>
									Clear
								</button>
							)}
						</div>

						{users && users.length > 5 && (
							<div className="px-1 pb-1 pt-0.5">
								<div className="relative">
									<Search className="absolute left-2 top-2 size-3 text-muted-foreground pointer-events-none" />
									<Input
										value={userSearch}
										onChange={(e) => setUserSearch(e.target.value)}
										onKeyDown={(e) => e.stopPropagation()}
										placeholder="Search assignees..."
										className="h-7 pl-6 text-xs bg-muted/40"
									/>
								</div>
							</div>
						)}

						<div className="max-h-44 overflow-y-auto custom-scrollbar space-y-0.5 pr-0.5">
							{isEmpty(filteredUsers) ? (
								<div className="px-2 py-3 text-center text-xs text-muted-foreground">
									No assignees found
								</div>
							) : (
								filteredUsers.map((user) => {
									const isSelected = selectedUserIds.includes(user.id);

									return (
										<DropdownMenuCheckboxItem
											key={user.id}
											checked={isSelected}
											onSelect={(e) => e.preventDefault()}
											onCheckedChange={() => toggleUser(user.id)}
											className="gap-2 cursor-pointer text-xs"
										>
											<Avatar className="size-4 shrink-0">
												<AvatarImage src={user.avatarUrl ?? ""} />
												<AvatarFallback className="text-[8px]">
													{user.name.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<span className="truncate">{user.name}</span>
										</DropdownMenuCheckboxItem>
									);
								})
							)}
						</div>
					</DropdownMenuGroup>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
