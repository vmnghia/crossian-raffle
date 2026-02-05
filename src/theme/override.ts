'use client';

import { createTheme, DEFAULT_THEME, mergeMantineTheme } from '@mantine/core';

import { Input } from './extends';

const themeOverride = createTheme({
	components: {
		Input,
	},
	defaultRadius: 'xs',
	primaryColor: 'crossian',
	cursorType: 'pointer',
	primaryShade: 7,
	colors: {
		crossian: [
			'#ebf0fe',
			'#d3dcf8',
			'#a3b6f4',
			'#708ef2',
			'#486df0',
			'#3257ef',
			'#274df0',
			'#1d3ed6',
			'#1537c0',
			'#0530ad',
		],
		yellow: [
			'#fff7e1',
			'#ffeecb',
			'#ffdb9a',
			'#ffce78', // yellow.3
			'#ffb638',
			'#ffab1b',
			'#ffa609',
			'#e39000',
			'#cb8000',
			'#b06d00',
		],
		amber: [
			'#fff4e1',
			'#ffe7cd',
			'#fbcf9e',
			'#f8b46b',
			'#f59d40',
			'#f4952f', // amber.5
			'#f38813',
			'#d97504',
			'#c16700',
			'#a85700',
		],
		red: [
			'#ffeaea',
			'#fdd2d2',
			'#f8a2a1',
			'#f56f6d',
			'#f34541',
			'#f22c25',
			'#f21f17',
			'#d8130d',
			'#c20b09', // red.8
			'#a80004',
		],
		scarlet: [
			'#ffebee',
			'#f8d3d9',
			'#f6a1af',
			'#f46e83',
			'#f3455e',
			'#f32f47',
			'#f4253b',
			'#d91b2e',
			'#c21428',
			'#ad0421',
		],
		'royal-blue': [
			'#9FACBB',
			'#8798AA',
			'#6E8398',
			'#566E87',
			'#3E5976',
			'#264565',
			'#0E3054',
			'#0D2B4C',
			'#0B2643',
			'#0A223B',
		],
		emerald: [
			'#E7EFED',
			'#B7CFC8',
			'#87AFA4',
			'#578F80',
			'#3F7F6D',
			'#276F5B',
			'#0F5F49',
			'#0C4C3A',
			'#09392C',
			'#06261D',
		],
	},
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
