import { BoltFlowLogo } from "@/components/logo/boltflow-logo";

const ORBIT_POINTS = [
	{ x: 113, y: 113, color: "#818cf8" },
	{ x: 113, y: 387, color: "#f59e0b" },
	{ x: 387, y: 113, color: "#10b981" },
	{ x: 387, y: 387, color: "#38bdf8" },
] as const;

export const AidlcOrbit = () => (
	<div className="relative mx-auto aspect-square w-full max-w-112">
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.18),transparent_68%)] blur-2xl dark:bg-[radial-gradient(circle,rgba(99,102,241,0.24),transparent_68%)]"
		/>
		<svg
			aria-hidden="true"
			className="relative size-full"
			viewBox="0 0 500 500"
			fill="none"
		>
			<defs>
				<radialGradient id="orbit-center">
					<stop stopColor="#6366f1" stopOpacity="0.22" />
					<stop offset="1" stopColor="#6366f1" stopOpacity="0" />
				</radialGradient>
				<linearGradient id="orbit-line" x1="70" y1="70" x2="430" y2="430">
					<stop stopColor="#818cf8" />
					<stop offset="0.5" stopColor="#10b981" />
					<stop offset="1" stopColor="#38bdf8" />
				</linearGradient>
			</defs>
			<circle cx="250" cy="250" r="220" fill="url(#orbit-center)" />
			<circle
				cx="250"
				cy="250"
				r="200"
				stroke="currentColor"
				strokeOpacity="0.08"
			/>
			<circle
				cx="250"
				cy="250"
				r="165"
				stroke="currentColor"
				strokeOpacity="0.14"
				strokeDasharray="3 9"
			/>
			<circle
				cx="250"
				cy="250"
				r="125"
				stroke="currentColor"
				strokeOpacity="0.1"
			/>
			<circle
				cx="250"
				cy="250"
				r="165"
				stroke="#818cf8"
				strokeWidth="2"
				strokeDasharray="190 847"
				transform="rotate(192 250 250)"
			/>
			<circle
				cx="250"
				cy="250"
				r="165"
				stroke="#f59e0b"
				strokeWidth="2"
				strokeDasharray="190 847"
				transform="rotate(102 250 250)"
			/>
			<circle
				cx="250"
				cy="250"
				r="165"
				stroke="#10b981"
				strokeWidth="2"
				strokeDasharray="190 847"
				transform="rotate(282 250 250)"
			/>
			<circle
				cx="250"
				cy="250"
				r="165"
				stroke="#38bdf8"
				strokeWidth="2"
				strokeDasharray="190 847"
				transform="rotate(12 250 250)"
			/>
			<path
				d="M113 113 250 250 387 113 M113 387 250 250 387 387"
				stroke="url(#orbit-line)"
				strokeOpacity="0.28"
			/>
			<path
				d="M250 64V90 M250 410v26 M64 250h26 M410 250h26"
				stroke="currentColor"
				strokeOpacity="0.25"
				strokeLinecap="round"
			/>
			{ORBIT_POINTS.map((point) => (
				<g key={`${point.x}-${point.y}`}>
					<circle
						cx={point.x}
						cy={point.y}
						r="27"
						fill={point.color}
						fillOpacity="0.12"
					/>
					<circle
						cx={point.x}
						cy={point.y}
						r="15"
						fill="var(--background)"
						stroke={point.color}
						strokeWidth="2"
					/>
					<circle cx={point.x} cy={point.y} r="5" fill={point.color} />
				</g>
			))}
		</svg>
		<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
			<div className="flex size-26 items-center justify-center rounded-[1.75rem] border border-border bg-background/95 shadow-[0_20px_55px_-18px_rgba(79,70,229,0.5)] ring-8 ring-primary/5 backdrop-blur-sm">
				<BoltFlowLogo className="size-15" />
			</div>
		</div>
	</div>
);
