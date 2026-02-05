import type { EmblaCarouselType } from 'embla-carousel';
import { range } from 'lodash-es';

const NUMBER_OF_PHASES = 20;

export const spin = (
	embla: EmblaCarouselType,
	drawTime: number,
	onIntervalChange?: (interval: number) => void,
	targetIndex?: number
) => {
	const speedUpPhases = Math.floor(NUMBER_OF_PHASES * 0.2);
	const peakPhases = Math.floor(NUMBER_OF_PHASES * 0.35);
	const peakEnd = speedUpPhases + peakPhases;
	const slowDownPhases = NUMBER_OF_PHASES - peakEnd;
	const minInterval = 50;
	const maxInterval = 250;
	const intervalRange = maxInterval - minInterval;

	const getInterval = (i: number) => {
		if (i < speedUpPhases) {
			return Math.max(minInterval, maxInterval - i * (intervalRange / speedUpPhases));
		} else if (i < peakEnd) {
			return minInterval;
		}

		return Math.min(maxInterval, minInterval + (i - peakEnd + 1) * (intervalRange / slowDownPhases));
	};

	const initialPhases = range(0, NUMBER_OF_PHASES).map(i => ({
		duration: drawTime / NUMBER_OF_PHASES,
		interval: Math.round(getInterval(i)),
	}));

	// Merge consecutive phases with the same interval
	const phases = initialPhases.reduce(
		(acc, phase) => {
			const lastPhase = acc[acc.length - 1];

			if (lastPhase?.interval === phase.interval) {
				lastPhase.duration += phase.duration;
			} else {
				acc.push({ ...phase });
			}

			return acc;
		},
		[] as Array<{ duration: number; interval: number }>
	);

	let phaseIndex = 0;
	let currentInterval: NodeJS.Timeout;
	let lastInterval: number | null = null;
	const isTargetMode = targetIndex !== undefined;
	let slowdownStarted = false;
	const spinStartTime = Date.now();

	const runPhase = () => {
		if (!isTargetMode && phaseIndex >= phases.length) return;

		const phase =
			isTargetMode && slowdownStarted ? phases[phases.length - 1] : phases[Math.min(phaseIndex, phases.length - 1)];

		if (lastInterval !== phase.interval) {
			onIntervalChange?.(phase.interval);
			lastInterval = phase.interval;
		}

		currentInterval = setInterval(() => {
			embla.scrollNext();

			// If in target mode, check if we've reached the target
			if (isTargetMode && targetIndex !== undefined) {
				const currentIndex = embla.selectedScrollSnap();
				const timeElapsed = Date.now() - spinStartTime;
				const minSpinTimeElapsed = timeElapsed >= drawTime * 0.8; // At least 80% of spin time must pass

				// Start slowing down when we're close to the target (within a few slides)
				const distanceToTarget =
					(targetIndex - currentIndex + embla.scrollSnapList().length) % embla.scrollSnapList().length;

				if (!slowdownStarted && minSpinTimeElapsed && distanceToTarget <= 3) {
					slowdownStarted = true;
					clearInterval(currentInterval);
					phaseIndex = phases.length - 1; // Jump to slowdown phase
					runPhase();

					return;
				}

				// Stop when we hit the exact target during slowdown
				if (slowdownStarted && currentIndex === targetIndex) {
					clearInterval(currentInterval);
				}
			}
		}, phase.interval);

		if (!isTargetMode) {
			setTimeout(() => {
				if (!slowdownStarted) {
					clearInterval(currentInterval);
					phaseIndex++;
					runPhase();
				}
			}, phase.duration);
		} else if (!slowdownStarted) {
			setTimeout(() => {
				if (!slowdownStarted && phaseIndex < phases.findLastIndex(p => p.interval === minInterval)) {
					clearInterval(currentInterval);
					phaseIndex++;
					runPhase();
				}
			}, phase.duration);
		}
	};

	runPhase();
};
