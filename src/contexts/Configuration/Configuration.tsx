'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';
import { v4 } from 'uuid';

import type { COE, Participant } from '@/types';

export type Prize = 'grand' | 'first' | 'second' | 'consolation';

const DEFAULT_NUMBER_OF_PRIZES: { [key in Prize]: number } = {
	grand: 1,
	first: 2,
	second: 3,
	consolation: 4,
};

export interface ConfigurationData {
	participants: Participant[];
	deleteWinners: boolean;
	spinTime: number;
	prizeDistribution: {
		[key in COE]?: number;
	};
	winners?: {
		participant: Participant;
		prize: Prize;
	}[];
	numberOfPrizes: {
		[key in Prize]: number;
	};
	currentPrize: Prize;
}

export interface ConfigurationContextProps {
	configuration: ConfigurationData;
	setConfiguration: Dispatch<SetStateAction<ConfigurationData>>;
	reset: () => void;
}

export const ConfigurationContext = createContext<ConfigurationContextProps | null>(null);

export const useConfiguration = () => {
	const context = useContext(ConfigurationContext);

	if (!context) {
		throw new Error('useConfiguration must be used within a ConfigurationProvider');
	}

	return context;
};

const subscribe = (callback: () => void) => {
	window.addEventListener('storage', callback);

	return () => window.removeEventListener('storage', callback);
};

const getSnapshot = () => {
	const stored = localStorage.getItem('configuration');

	if (stored) {
		return stored;
	}

	return null;
};

const getServerSnapshot = () => null;

export const defaultConfig: ConfigurationData = {
	participants: [{ id: v4(), name: '' }],
	deleteWinners: true,
	spinTime: 5000,
	prizeDistribution: {
		BEVA: 3,
		'TECH.PMI': 2,
		CEE: 2,
	},
	winners: [],
	numberOfPrizes: DEFAULT_NUMBER_OF_PRIZES,
	currentPrize: 'consolation',
};

export const ConfigurationProvider = ({ children }: { children: ReactNode }) => {
	const storedConfiguration = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	const configuration = useMemo(() => {
		try {
			return storedConfiguration
				? (JSON.parse(decompressFromUTF16(storedConfiguration)) as ConfigurationData)
				: defaultConfig;
		} catch (e) {
			console.error('Error parsing configuration from localStorage:', e);

			return defaultConfig;
		}
	}, [storedConfiguration]);

	const value = useMemo(
		() => ({
			configuration,
			setConfiguration: (newConfiguration: SetStateAction<ConfigurationData>) => {
				const updatedConfiguration =
					typeof newConfiguration === 'function' ? newConfiguration(configuration) : newConfiguration;

				const newValue = updatedConfiguration ? compressToUTF16(JSON.stringify(updatedConfiguration)) || '' : '';

				localStorage.setItem('configuration', newValue);

				window.dispatchEvent(new StorageEvent('storage', { key: 'sidebar', newValue }));
			},
			reset: () => {
				const newValue = compressToUTF16(JSON.stringify(defaultConfig)) || '';

				localStorage.setItem('configuration', newValue);

				window.dispatchEvent(new StorageEvent('storage', { key: 'sidebar', newValue }));
			},
		}),
		[configuration]
	);

	return <ConfigurationContext.Provider value={value}>{children}</ConfigurationContext.Provider>;
};
