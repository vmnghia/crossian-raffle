'use client';

import { Stack, Text, Title } from '@mantine/core';
import { capitalize } from 'lodash-es';
import Image from 'next/image';

import airpodsImg from './airpods-pro.png';
import appleWatchImg from './apple-watch.png';
import ipadImg from './ipad-air.png';
import macbookImg from './macbook.png';

import { useConfiguration } from '@/contexts/Configuration';

const prizesData = {
	consolation: {
		name: 'AirPods Pro',
		imageUrl: airpodsImg,
	},
	second: {
		name: 'Apple Watch',
		imageUrl: appleWatchImg,
	},
	first: {
		name: 'iPad Air',
		imageUrl: ipadImg,
	},
	grand: {
		name: 'MacBook Pro',
		imageUrl: macbookImg,
	},
};

export const PrizeImage = () => {
	const { configuration } = useConfiguration();
	const { currentPrize } = configuration;
	const prize = currentPrize in prizesData ? prizesData[currentPrize] : null;

	if (!prize) {
		return null;
	}

	return (
		<Stack align='center'>
			<Title
				c='amber.5'
				order={2}
				size={48}
			>
				{capitalize(currentPrize)} Prize
			</Title>
			<Image
				alt='MacBook'
				className='object-cover'
				src={prize.imageUrl}
			/>
			<Text size='xl'>{prize.name}</Text>
		</Stack>
	);
};
