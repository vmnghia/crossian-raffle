'use client';

import { Card, CardSection, Stack } from '@mantine/core';
import Image from 'next/image';

import { useConfiguration } from '@/contexts/Configuration';
import { PRIZES_DATA } from '@/data/prizes';

export const PrizeImage = () => {
	const { configuration } = useConfiguration();
	const { currentPrize } = configuration;
	const prize = PRIZES_DATA[currentPrize];

	if (!prize) {
		return null;
	}

	return (
		<Stack
			align='center'
			className='w-full px-24'
		>
			<Card
				className='relative aspect-[1.5] w-full'
				radius='xl'
				shadow='xl'
			>
				<CardSection>
					<Image
						alt={prize.name || 'Prize Image'}
						className='object-cover'
						fill
						sizes='(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 50vw'
						src={prize.imageUrl}
					/>
				</CardSection>
			</Card>
		</Stack>
	);
};
