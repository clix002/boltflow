import type { Maybe } from "@scrum-board/shared/types";

const AUDIO_STATE = {
	SUSPENDED: "suspended",
} as const;

const OSCILLATOR_TYPE = {
	SINE: "sine",
	TRIANGLE: "triangle",
} as const;

type OscillatorKind = (typeof OSCILLATOR_TYPE)[keyof typeof OSCILLATOR_TYPE];

type ToneConfig = {
	type: OscillatorKind;
	startFreq: number;
	endFreq: number;
	duration: number;
	gain?: number;
	delay?: number;
};

let audioContext: Maybe<AudioContext> = null;

function getAudioContext(): Maybe<AudioContext> {
	if (typeof window === "undefined" || !("AudioContext" in window)) {
		return null;
	}
	if (!audioContext) {
		audioContext = new window.AudioContext();
	}
	if (audioContext.state === AUDIO_STATE.SUSPENDED) {
		audioContext.resume().catch(() => {});
	}
	return audioContext;
}

function playTone(config: ToneConfig): void {
	const ctx = getAudioContext();
	if (!ctx) return;

	const {
		type,
		startFreq,
		endFreq,
		duration,
		gain: peakGain = 0.12,
		delay = 0,
	} = config;

	const startTime = ctx.currentTime + delay;
	const stopTime = startTime + duration;

	const oscillator = ctx.createOscillator();
	const gainNode = ctx.createGain();

	oscillator.type = type;
	oscillator.frequency.setValueAtTime(startFreq, startTime);
	oscillator.frequency.exponentialRampToValueAtTime(endFreq, stopTime);

	gainNode.gain.setValueAtTime(peakGain, startTime);
	gainNode.gain.exponentialRampToValueAtTime(0.001, stopTime);

	oscillator.connect(gainNode);
	gainNode.connect(ctx.destination);

	oscillator.start(startTime);
	oscillator.stop(stopTime + 0.005);
}

/**
 * Tactile upward "pop" when moving/dropping a task card.
 */
export function playTaskMoveSound(): void {
	playTone({
		type: OSCILLATOR_TYPE.SINE,
		startFreq: 320,
		endFreq: 580,
		duration: 0.075,
		gain: 0.12,
	});
}

/**
 * Bright two-note ascending chime when creating a new task.
 */
export function playTaskCreateSound(): void {
	playTone({
		type: OSCILLATOR_TYPE.SINE,
		startFreq: 523.25,
		endFreq: 540,
		duration: 0.07,
		gain: 0.1,
		delay: 0,
	});
	playTone({
		type: OSCILLATOR_TYPE.SINE,
		startFreq: 659.25,
		endFreq: 783.99,
		duration: 0.11,
		gain: 0.12,
		delay: 0.055,
	});
}

/**
 * Crisp two-note descending tone when deleting a task or column.
 */
export function playTaskDeleteSound(): void {
	playTone({
		type: OSCILLATOR_TYPE.TRIANGLE,
		startFreq: 587.33,
		endFreq: 493.88,
		duration: 0.075,
		gain: 0.18,
		delay: 0,
	});
	playTone({
		type: OSCILLATOR_TYPE.TRIANGLE,
		startFreq: 440,
		endFreq: 293.66,
		duration: 0.12,
		gain: 0.22,
		delay: 0.06,
	});
}
