'use client';

import { useEffect, useMemo, useState } from 'react';
import { Carousel } from '@mantine/carousel';
import { Box, Button, Card, Paper, Stack, Text } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { clsx } from 'clsx';
import type { EmblaCarouselType } from 'embla-carousel';
import { sample, shuffle } from 'lodash-es';
import Image from 'next/image';

import { COES } from '../Configuration/constants';
import cloud1 from './cloud_1.png';
import cloud2 from './cloud_2.png';
import { spin } from './spin';
import { WinnerModal } from './WinnerModal';

import type { Prize } from '@/contexts/Configuration';
import { useConfiguration } from '@/contexts/Configuration';
import type { Participant } from '@/types';

const PRIZE_ORDER: Prize[] = ['grand', 'first', 'second', 'consolation'];

const getNextPrize = (currentPrize: Prize | null): Prize => {
	switch (currentPrize) {
		case 'consolation':
			return 'second';
		case 'second':
			return 'first';
		case 'first':
		case 'grand':
			return 'grand';
		default:
			return 'consolation';
	}
};

export const Raffle = () => {
	const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
	const [enabled, toggle] = useToggle();
	const [modalOpened, setModalOpened] = useState(false);
	const [spinning, setSpinning] = useState(false);
	const [phaseInterval, setPhaseInterval] = useState<number | null>(null);
	const [lastWinner, setLastWinner] = useState<Participant | null>(null);
	const {
		configuration: {
			participants,
			spinTime,
			prizeDistribution,
			winners = [],
			numberOfPrizes,
			deleteWinners,
			currentPrize,
		},
		setConfiguration,
	} = useConfiguration();

	const nextPrize = useMemo(() => {
		const currentPrizeCount = numberOfPrizes[currentPrize || 'consolation'] || 0;
		const currentPrizeWinners = winners.filter(w => w.prize === currentPrize).length;
		const shouldAdvance = currentPrizeWinners >= currentPrizeCount;

		return shouldAdvance ? getNextPrize(currentPrize) : currentPrize;
	}, [currentPrize, numberOfPrizes, winners]);

	useEffect(() => {
		setConfiguration(prev => ({
			...prev,
			currentPrize: nextPrize,
		}));
	}, [nextPrize, setConfiguration]);

	const hasParticipants = participants.length > 1 && participants.some(p => p.name && p.name.trim() !== '');

	useEffect(() => {
		if (embla && enabled) {
			embla.on('settle', e => {
				const winner = participants[e.selectedScrollSnap()];

				setConfiguration(prev => ({
					...prev,
					winners: [
						...(prev.winners ?? []),
						{
							participant: winner,
							prize: nextPrize,
						},
					],
					participants: deleteWinners ? prev.participants.filter(p => p.id !== winner.id) : prev.participants,
				}));
				setLastWinner(winner);
				setModalOpened(true);
				setSpinning(false);
				toggle(false);
			});

			const prizeDistributionSatisfied = Object.entries(prizeDistribution).every(([coe, count]) => {
				const awardedCount = winners?.filter(w => w.participant.coe === coe).length ?? 0;

				return awardedCount >= count;
			});

			const nextCOE = !prizeDistributionSatisfied
				? shuffle(Object.entries(prizeDistribution)).find(([coe, count]) => {
						const awardedCount = winners?.filter(w => w.participant.coe === coe).length ?? 0;

						return awardedCount < count;
					})?.[0] || null
				: sample(
						COES.filter(coe => {
							return Object.keys(prizeDistribution).includes(coe);
						})
					);

			const targetIndex = participants.findIndex(p => p.coe === nextCOE);

			spin(embla, spinTime, interval => setPhaseInterval(interval), targetIndex !== -1 ? targetIndex : undefined);
		}
	}, [
		currentPrize,
		deleteWinners,
		embla,
		enabled,
		nextPrize,
		numberOfPrizes,
		participants,
		prizeDistribution,
		setConfiguration,
		spinTime,
		toggle,
		winners,
	]);

	useEffect(() => {
		if (enabled) {
			// If no target winner is specified, use the normal timeout
			if (!lastWinner) {
				const timeout = setTimeout(() => {
					toggle();
				}, spinTime);

				return () => clearTimeout(timeout);
			}
			// If target winner is specified, the spin function will handle stopping
		}
	}, [enabled, toggle, spinTime, lastWinner]);

	const hasRemainingPrizes = PRIZE_ORDER.some(prize => {
		const awardedCount = winners?.filter(w => w.prize === prize).length ?? 0;

		return awardedCount < (numberOfPrizes[prize] || 0);
	});

	return (
		<Stack
			align='center'
			className='w-full max-w-5xl'
		>
			<Card
				className='w-full overflow-visible p-8'
				radius='xl'
				shadow='md'
			>
				<Image
					alt='cloud'
					className='absolute -bottom-19.5 -left-22'
					src={cloud1}
				/>
				<Image
					alt='cloud'
					className='absolute -top-10 -right-16'
					src={cloud2}
				/>
				<Box
					bg='url(/images/slot-bg.png) no-repeat center/cover'
					className='absolute inset-0'
				/>
				<Box
					className={clsx(
						'pointer-events-none absolute inset-3 z-1 size-[calc(100%-1.5rem)] rounded-3xl border-12 border-dotted border-(--mantine-color-yellow-9)',
						spinning && 'animate-blink'
					)}
				/>
				<Paper
					bg='emerald.7'
					className='flex h-56 w-full'
					radius='lg'
				>
					<Carousel
						className='w-full flex-1'
						draggable={false}
						emblaOptions={{ loop: true, dragFree: true, duration: 80, watchDrag: false, watchFocus: false }}
						getEmblaApi={setEmbla}
						height='100%'
						orientation='vertical'
						withControls={false}
					>
						{participants.map(({ id, name, coe }) => (
							<Carousel.Slide
								key={id}
								className='flex h-full w-full items-center justify-center border-b border-white/20 text-[44px] font-bold blur-(--blur)'
								style={{
									'--blur': phaseInterval && phaseInterval < 200 ? `${Math.min(200 / phaseInterval, 2)}px` : '0px',
								}}
							>
								<Text
									c='yellow.1'
									inherit
									span
								>
									{name} - {coe}
								</Text>
							</Carousel.Slide>
						))}
					</Carousel>
				</Paper>
			</Card>
			<Button
				bg='linear-gradient(15deg,rgba(214, 178, 81, 1) 0%, rgba(250, 244, 165, 1) 50%, rgba(214, 178, 81, 1) 100%)'
				c='yellow.9'
				className='mt-10 w-64 text-2xl font-bold hover:brightness-110 disabled:brightness-75'
				color='yellow.4'
				disabled={spinning || !hasParticipants || !hasRemainingPrizes}
				radius='lg'
				size='xl'
				onClick={() => {
					toggle();
					setSpinning(true);
				}}
			>
				DRAW
			</Button>
			<WinnerModal
				onClose={() => setModalOpened(false)}
				opened={modalOpened}
				prize={winners.find(w => w.participant.id === lastWinner?.id)?.prize}
				winner={`${lastWinner?.name} - ${lastWinner?.coe}`}
			/>
		</Stack>
	);
};
