'use client';

import { AspectRatio, Box, Grid, Paper, Text } from '@mantine/core';
import { reverse } from 'lodash-es';
import Image from 'next/image';

import { useConfiguration } from '@/contexts/Configuration';
import { PRIZES_DATA } from '@/data/prizes';

export const WinnersList = () => {
	const { configuration } = useConfiguration();
	const winners = reverse([...(configuration.winners ?? [])]);

	const firstWinners = winners.slice(1, 3);
	const secondWinners = winners.slice(3, 6);
	const thirdWinners = winners.slice(6);

	return (
		<div>
			<Grid
				className='mx-[22dvw]'
				columns={12}
			>
				<Grid.Col
					offset={3}
					span={6}
				>
					<PrizeImage prize={PRIZES_DATA[0]} />
					<Text className='mt-2 text-center text-base font-semibold'>
						{winners[0]?.participant.name} - {winners[0]?.participant.coe}
					</Text>
				</Grid.Col>

				{firstWinners.map((winner, index) => {
					const prize = PRIZES_DATA[winner.prize];

					if (!prize) {
						return null;
					}

					return (
						<Grid.Col
							key={winner.participant.id}
							offset={index === 0 ? 2 : 0}
							span={4}
						>
							<PrizeImage prize={prize} />
							<Text className='mt-2 text-center text-base font-semibold'>
								{winner.participant.name} - {winner.participant.coe}
							</Text>
						</Grid.Col>
					);
				})}
				{secondWinners.map(winner => {
					const prize = PRIZES_DATA[winner.prize];

					if (!prize) {
						return null;
					}

					return (
						<Grid.Col
							key={winner.participant.id}
							span={4}
						>
							<PrizeImage prize={prize} />
							<Text className='mt-2 text-center text-base font-semibold'>
								{winner.participant.name} - {winner.participant.coe}
							</Text>
						</Grid.Col>
					);
				})}
				{thirdWinners.map(winner => {
					const prize = PRIZES_DATA[winner.prize];

					if (!prize) {
						return null;
					}

					return (
						<Grid.Col
							key={winner.participant.id}
							span={3}
						>
							<PrizeImage prize={prize} />
							<Text className='mt-2 text-center text-base font-semibold'>
								{winner.participant.name} - {winner.participant.coe}
							</Text>
						</Grid.Col>
					);
				})}
			</Grid>
		</div>
	);
};

const PrizeImage = ({ prize }: { prize: (typeof PRIZES_DATA)[number] }) => {
	return (
		<Paper
			className='overflow-hidden'
			radius={24}
			shadow='lg'
		>
			<AspectRatio
				className='-mt-[15%]'
				ratio={1.5}
			>
				<Box className='relative w-full'>
					<Image
						alt={prize.name || 'Prize Image'}
						className='object-cover'
						fill
						sizes='(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 50vw'
						src={prize.imageUrl}
					/>
				</Box>
			</AspectRatio>
		</Paper>
	);
};
