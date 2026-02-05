import type { DefaultMantineColor, MantineColorsTuple } from '@mantine/core';

type ExtendedCustomColors = 'crossian' | 'royal-blue' | 'amber' | 'scarlet' | 'emerald' | DefaultMantineColor;

declare module '@mantine/core' {
	export interface MantineThemeColorsOverride {
		colors: Record<ExtendedCustomColors, MantineColorsTuple>;
	}
}
