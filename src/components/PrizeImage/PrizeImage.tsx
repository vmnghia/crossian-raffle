'use client';

import { useEffect, useState } from 'react';
import { Carousel } from '@mantine/carousel';
import { Card, Stack } from '@mantine/core';
import type { EmblaCarouselType } from 'embla-carousel';
import { reverse } from 'lodash-es';
import Image from 'next/image';

import { useConfiguration } from '@/contexts/Configuration';
import { PRIZES_DATA } from '@/data/prizes';

export const PrizeImage = () => {
	const { configuration } = useConfiguration();

	const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
	const { currentPrize } = configuration;

	useEffect(() => {
		if (embla) {
			embla.scrollTo(9 - currentPrize);
		}
	}, [currentPrize, embla]);

	return (
		<Stack
			align='center'
			className='w-full px-24'
		>
			<Card
				className='relative aspect-[1.5] w-full bg-transparent'
				padding={0}
				radius='xl'
				shadow='xl'
			>
				<Carousel
					className='pointer-events-none size-full'
					getEmblaApi={setEmbla}
					initialSlide={9 - currentPrize}
					withControls={false}
					withIndicators={false}
					classNames={{
						viewport: 'size-full',
						container: 'size-full',
					}}
				>
					{reverse([...PRIZES_DATA]).map(prize => (
						<Carousel.Slide key={prize.name}>
							<Image
								alt={prize.name || 'Prize Image'}
								blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkSPxfDwADqgHh5Lh3ywAAAABJRU5ErkJggg=='
								className='object-cover'
								fetchPriority='high'
								fill
								loading='eager'
								placeholder='blur'
								sizes='40vw'
								src={prize.imageUrl}
							/>
						</Carousel.Slide>
					))}
				</Carousel>
			</Card>
		</Stack>
	);
};
