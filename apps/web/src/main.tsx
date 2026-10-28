import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { ConfirmProvider } from "./hooks/confirm-provider.tsx";
import { queryClient } from "./lib/react-query.ts";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<QueryClientProvider client={queryClient}>
				<ConfirmProvider>
					<App />
					<Toaster richColors />
				</ConfirmProvider>
			</QueryClientProvider>
		</ThemeProvider>
	</StrictMode>,
);
