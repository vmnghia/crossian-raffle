import type { EmblaCarouselType } from 'embla-carousel';

export const spin = (
	embla: EmblaCarouselType,
	drawTime: number,
	onIntervalChange?: (interval: number) => void,
	targetIndex?: number
) => {
	const minInterval = 50;
	const maxInterval = 250;
	const totalSlides = embla.scrollSnapList().length;

	// Calculate target scroll count
	const currentIndex = embla.selectedScrollSnap();
	let targetScrollCount: number;

	if (targetIndex !== undefined) {
		// Calculate distance to target, ensuring at least 2 full loops for visual effect
		const baseDistance = (targetIndex - currentIndex + totalSlides) % totalSlides;
		const minLoops = 2;

		targetScrollCount = minLoops * totalSlides + baseDistance;
	} else {
		// Random mode: scroll for approximately the draw time at average speed
		const avgInterval = (minInterval + maxInterval) / 2;

		targetScrollCount = Math.floor(drawTime / avgInterval);
	}

	// Define phase proportions
	const speedUpProportion = 0.2;
	const peakProportion = 0.4;
	const slowDownProportion = 0.4;

	// Calculate scroll counts for each phase
	const speedUpScrolls = Math.floor(targetScrollCount * speedUpProportion);
	const peakScrolls = Math.floor(targetScrollCount * peakProportion);
	const slowDownScrolls = targetScrollCount - speedUpScrolls - peakScrolls;

	// Calculate time allocation for each phase
	const speedUpTime = drawTime * speedUpProportion;
	const peakTime = drawTime * peakProportion;
	const slowDownTime = drawTime * slowDownProportion;

	let scrollCounter = 0;
	let lastReportedInterval: number | null = null;

	const getIntervalForScroll = (scroll: number): number => {
		if (scroll < speedUpScrolls) {
			// Speed up: from maxInterval to minInterval
			const progress = scroll / speedUpScrolls;

			return Math.round(maxInterval - progress * (maxInterval - minInterval));
		} else if (scroll < speedUpScrolls + peakScrolls) {
			// Peak: constant minInterval
			return minInterval;
		}

		// Slow down: from minInterval to maxInterval
		const slowDownIndex = scroll - speedUpScrolls - peakScrolls;
		const progress = slowDownIndex / slowDownScrolls;

		return Math.round(minInterval + progress * (maxInterval - minInterval));
	};

	const getDelayForScroll = (scroll: number): number => {
		if (scroll < speedUpScrolls) {
			return speedUpTime / speedUpScrolls;
		} else if (scroll < speedUpScrolls + peakScrolls) {
			return peakTime / peakScrolls;
		}

		return slowDownTime / slowDownScrolls;
	};

	const scheduleNextScroll = () => {
		if (scrollCounter >= targetScrollCount) {
			return; // Done
		}

		const interval = getIntervalForScroll(scrollCounter);

		// Report interval changes for blur effect
		if (interval !== lastReportedInterval) {
			onIntervalChange?.(interval);
			lastReportedInterval = interval;
		}

		embla.scrollNext();
		scrollCounter++;

		const delay = getDelayForScroll(scrollCounter - 1);

		setTimeout(scheduleNextScroll, delay);
	};

	scheduleNextScroll();
};
