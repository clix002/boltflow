import { AuthDialog } from "@/feature/auth/components/auth-dialog";
import { AidlcPillarsSection } from "./aidlc-pillars-section";
import { HeroShowcase } from "./hero-showcase";
import { MarketingCta } from "./marketing-cta";
import { MarketingFooter } from "./marketing-footer";
import { MarketingHeader } from "./marketing-header";

export const Marketing = () => {
	return (
		<div className="relative flex min-h-svh flex-col bg-background text-foreground">
			{/* Architectural Grid Canvas (visible in both Light & Dark modes) */}
			<div
				aria-hidden="true"
				className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,rgba(120,120,128,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,128,0.09)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_90%_80%_at_50%_15%,#000_55%,transparent_100%)]"
			/>

			<MarketingHeader />

			<main className="relative z-10 flex flex-1 flex-col">
				<HeroShowcase />
				<AidlcPillarsSection />
				<MarketingCta />
			</main>

			<div className="relative z-10">
				<MarketingFooter />
			</div>
			<AuthDialog />
		</div>
	);
};
