import type { Maybe } from "@scrum-board/shared/types";

let audioContext: Maybe<AudioContext> = null;

function getAudioContext(): Maybe<AudioContext> {
	if (typeof window === "undefined" || !("AudioContext" in window)) {
		return null;
	}
	if (!audioContext) {
		audioContext = new window.AudioContext();
	}
	if (audioContext.state === "suspended") {
		audioContext.resume().catch(() => {});
	}
	return audioContext;
}

/**
 * Plays a short, subtle tactile "pop" sound using the Web Audio API
 * when a task card is dropped into a new position.
 */
export function playTaskMoveSound(): void {
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	const oscillator = ctx.createOscillator();
	const gain = ctx.createGain();

	oscillator.type = "sine";
	oscillator.frequency.setValueAtTime(320, now);
	oscillator.frequency.exponentialRampToValueAtTime(580, now + 0.065);

	gain.gain.setValueAtTime(0.12, now);
	gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

	oscillator.connect(gain);
	gain.connect(ctx.destination);

	oscillator.start(now);
	oscillator.stop(now + 0.08);
}
