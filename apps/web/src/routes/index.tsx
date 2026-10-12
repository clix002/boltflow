import type { ComponentType } from "react";
import { createBrowserRouter } from "react-router";
import { AppLayout } from "@/components/layout/app-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { BoardHeader } from "@/feature/board/components/board/board-header";
import { BoardSidebar } from "@/feature/board/components/board/board-sidebar";
import { BoardSidebarHeader } from "@/feature/board/components/board/board-sidebar-header";
import { BoardDetailSidebar } from "@/feature/board/components/board-detail/board-detail-sidebar";
import { BoardDetailSidebarHeader } from "@/feature/board/components/board-detail/board-detail-sidebar-header";
import {
	BoardDetailPage,
	BoardPage,
	LoginPage,
	NotFoundPage,
	RegisterPage,
} from "@/pages";

export type RouteHandle = {
	sidebar?: ComponentType;
	sidebarHeader?: ComponentType;
	headerContent?: ComponentType;
};

export const routes = createBrowserRouter([
	{
		path: "*",
		Component: () => <NotFoundPage />,
	},
	{
		path: "/login",
		Component: () => <LoginPage />,
	},
	{
		path: "/register",
		Component: () => <RegisterPage />,
	},
	{
		path: "/",
		Component: () => (
			<ProtectedRoute>
				<AppLayout />
			</ProtectedRoute>
		),
		children: [
			{
				index: true,
				Component: () => <BoardPage />,
				handle: {
					sidebar: BoardSidebar,
					sidebarHeader: BoardSidebarHeader,
					headerContent: BoardHeader,
				},
			},
			{
				path: "board/:boardId",
				Component: () => <BoardDetailPage />,
				handle: {
					sidebar: BoardDetailSidebar,
					sidebarHeader: BoardDetailSidebarHeader,
				},
			},
		],
	},
]);
