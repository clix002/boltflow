import { cva } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import { AidlcHierarchyDiagram } from "./aidlc-hierarchy-diagram";
import { AidlcOrbit } from "./aidlc-orbit";
import { AidlcPipelineDiagram } from "./aidlc-pipeline-diagram";
import { AwsCreditBanner } from "./aws-credit-banner";
import {
	AIDLC_PILLARS,
	type AidlcPillarItem,
	AWS_AIDLC_URL,
	PILLAR_TONE,
} from "./marketing.constants";

const pillarIconVariants = cva(
	"flex size-10 items-center justify-center rounded-xl border",
	{
		variants: {
			tone: {
				[PILLAR_TONE.INDIGO]:
					"border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
				[PILLAR_TONE.AMBER]:
					"border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
				[PILLAR_TONE.EMERALD]:
					"border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
				[PILLAR_TONE.SKY]:
					"border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
			},
		},
		defaultVariants: {
			tone: PILLAR_TONE.INDIGO,
		},
	},
);

const PillarCallout = ({
	pillar,
	number,
}: {
	pillar: AidlcPillarItem;
	number: number;
}) => {
	const Icon = pillar.icon;

	return (
		<li className="border-t border-border/70 pt-5">
			<div className="flex items-center gap-3">
				<div className={pillarIconVariants({ tone: pillar.tone })}>
					<Icon className="size-5" />
				</div>
				<span className="font-mono text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
					0{number} / {pillar.badge}
				</span>
			</div>
			<h3 className="mt-4 font-heading text-xl font-semibold tracking-tight">
				{pillar.title}
			</h3>
			<p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
				{pillar.description}
			</p>
		</li>
	);
};

export const AidlcPillarsSection = () => {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 pb-12 sm:gap-28 sm:px-6 sm:pb-16">
			<section id="methodology" className="scroll-mt-20">
				<div className="mx-auto max-w-3xl text-center">
					<Badge
						variant="outline"
						className="mb-3 border-primary/30 bg-primary/10 text-primary"
					>
						Inspired by AI-DLC
					</Badge>
					<h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
						AI moves the work forward. Your team stays in control.
					</h2>
					<p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
						In the{" "}
						<a
							href={AWS_AIDLC_URL}
							target="_blank"
							rel="noreferrer"
							className="font-medium text-foreground underline decoration-primary/50 underline-offset-4 hover:text-primary"
						>
							AWS AI-Driven Development Lifecycle
						</a>
						, AI proposes plans and implementation while people clarify and
						validate the important decisions. BoltFlow brings that work into
						focused Units, short Bolts, and connected GitHub branches.
					</p>
				</div>

				<div className="mt-14 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,1.3fr)_minmax(0,1fr)] lg:gap-5">
					<ol className="flex flex-col gap-10 lg:gap-24">
						{AIDLC_PILLARS.slice(0, 2).map((pillar, index) => (
							<PillarCallout
								key={pillar.title}
								pillar={pillar}
								number={index + 1}
							/>
						))}
					</ol>
					<div className="order-first lg:order-none">
						<AidlcOrbit />
					</div>
					<ol start={3} className="flex flex-col gap-10 lg:gap-24">
						{AIDLC_PILLARS.slice(2).map((pillar, index) => (
							<PillarCallout
								key={pillar.title}
								pillar={pillar}
								number={index + 3}
							/>
						))}
					</ol>
				</div>
			</section>

			<section id="architecture" className="scroll-mt-20">
				<div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div>
						<Badge
							variant="outline"
							className="mb-2 border-primary/30 bg-primary/10 text-primary"
						>
							A structure that mirrors your work
						</Badge>
						<h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
							From board to branch, everything has a place.
						</h2>
					</div>
					<p className="max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
						Connect a board to a repository. Organize work into Units, then
						follow each task through its branch and review.
					</p>
				</div>

				<AidlcHierarchyDiagram />
			</section>

			<section id="workflow" className="scroll-mt-20">
				<div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div>
						<Badge
							variant="outline"
							className="mb-2 border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400"
						>
							How it works
						</Badge>
						<h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
							From a repository to a reviewed pull request.
						</h2>
					</div>
					<p className="max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
						Connect the project once, then keep Units, tasks, and GitHub work
						moving together.
					</p>
				</div>

				<AidlcPipelineDiagram />
			</section>

			<AwsCreditBanner />
		</div>
	);
};
