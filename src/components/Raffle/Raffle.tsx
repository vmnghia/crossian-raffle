'use client';

import { useEffect, useState } from 'react';
import { Carousel } from '@mantine/carousel';
import { Box, Button, Card, Paper, Stack, Text } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { clsx } from 'clsx';
import type { EmblaCarouselType } from 'embla-carousel';
import Image from 'next/image';

import cloud1 from './cloud_1.png';
import cloud2 from './cloud_2.png';
import { spin } from './spin-old';
import { WinnerModal } from './WinnerModal';

import { useConfiguration } from '@/contexts/Configuration';
import type { Participant } from '@/types';

export const Raffle = () => {
	const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
	const [enabled, toggle] = useToggle();
	const [modalOpened, setModalOpened] = useState(false);
	const [spinning, setSpinning] = useState(false);
	const [phaseInterval, setPhaseInterval] = useState<number | null>(null);
	const [lastWinner, setLastWinner] = useState<Participant | null>(null);
	const {
		configuration: { participants, spinTime, winners = [], deleteWinners, currentPrize, preordainedWinners },
		setConfiguration,
	} = useConfiguration();

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
							prize: prev.currentPrize,
						},
					],
					participants: deleteWinners ? prev.participants.filter(p => p.id !== winner.id) : prev.participants,
					currentPrize: prev.currentPrize >= 0 ? prev.currentPrize - 1 : prev.currentPrize,
				}));
				setLastWinner(winner);
				setModalOpened(true);
				setSpinning(false);
				toggle(false);
			});

			// const targetIndex = participants.findIndex(p => Boolean(preordainedWinners.find(w => w.id === p.id)));

			spin(embla, spinTime, interval => setPhaseInterval(interval));
		}
	}, [deleteWinners, embla, enabled, participants, preordainedWinners, setConfiguration, spinTime, toggle]);

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

	const hasRemainingPrizes = currentPrize >= 0;

	return (
		<Stack
			align='center'
			className='w-full max-w-5xl'
		>
			<Card
				className='w-full overflow-visible p-8'
				radius={40}
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
					bg='url(/images/slot-bg.png) no-repeat center/100% 100%'
					className='absolute inset-0 size-full'
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
						emblaOptions={{ loop: true, dragFree: true, duration: 70, watchDrag: false, watchFocus: false }}
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
									c='yellow.7'
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
