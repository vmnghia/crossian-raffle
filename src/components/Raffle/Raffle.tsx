'use client';

import { startTransition, useEffect, useState } from 'react';
import { Carousel } from '@mantine/carousel';
import { Box, Button, Card, Paper, Stack, Text } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import confetti from 'canvas-confetti';
import { clsx } from 'clsx';
import type { EmblaCarouselType } from 'embla-carousel';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import cloud1 from './cloud_1.png';
import cloud2 from './cloud_2.png';
import { spin } from './spin-old';
import { WinnerModal } from './WinnerModal';

import { useConfiguration } from '@/contexts/Configuration';
import type { Participant } from '@/types';

const firework = (duration: number) => {
	const animationEnd = Date.now() + duration;
	const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

	function randomInRange(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	const interval = setInterval(() => {
		const timeLeft = animationEnd - Date.now();

		if (timeLeft <= 0) {
			return clearInterval(interval);
		}

		const particleCount = 100 * (timeLeft / duration);

		// since particles fall down, start a bit higher than random
		confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
		confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
	}, 500);
};

export const Raffle = () => {
	const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
	const [enabled, toggleEnabled] = useToggle();
	const [modalOpened, setModalOpened] = useState(false);
	const [spinning, setSpinning] = useState(false);
	const [phaseInterval, setPhaseInterval] = useState<number | null>(null);
	const [lastWinner, setLastWinner] = useState<Participant | null>(null);
	const {
		configuration: { participants, spinTime, deleteWinners, currentPrize, preordainedWinners },
		setConfiguration,
	} = useConfiguration();
	const router = useRouter();

	const hasParticipants = participants.length > 1 && participants.some(p => p.name && p.name.trim() !== '');

	useEffect(() => {
		if (embla && enabled) {
			embla.on('settle', e => {
				const winner = participants[e.selectedScrollSnap()];

				setLastWinner(winner);
				setModalOpened(true);
				setSpinning(false);
				toggleEnabled(false);
			});

			const targetIndex = participants.findIndex(p => Boolean(preordainedWinners.find(w => w.name === p.name)));

			spin(embla, spinTime, interval => setPhaseInterval(interval), targetIndex >= 0 ? targetIndex : undefined);
		}
	}, [
		currentPrize,
		deleteWinners,
		embla,
		enabled,
		participants,
		preordainedWinners,
		setConfiguration,
		spinTime,
		toggleEnabled,
	]);

	useEffect(() => {
		if (enabled) {
			// If no target winner is specified, use the normal timeout
			if (!lastWinner) {
				const timeout = setTimeout(() => {
					toggleEnabled();
				}, spinTime);

				return () => clearTimeout(timeout);
			}
			// If target winner is specified, the spin function will handle stopping
		}
	}, [enabled, toggleEnabled, spinTime, lastWinner]);

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
					toggleEnabled(true);
					setSpinning(true);
					firework(spinTime + 1000);
				}}
			>
				DRAW
			</Button>
			<WinnerModal
				opened={modalOpened}
				// prize={winners.find(w => w.participant.id === lastWinner?.id)?.prize}
				winner={lastWinner}
				onCancel={lastWinner => {
					setModalOpened(false);
					startTransition(() => {
						setConfiguration(prev => ({
							...prev,
							participants: participants.filter(p => p.id !== lastWinner?.id),
							preordainedWinners: prev.preordainedWinners
								.filter(w => w.name !== lastWinner?.name)
								.concat(lastWinner ? (participants.find(p => p.coe === lastWinner.coe) ?? []) : []),
						}));
					});
				}}
				onClose={() => {
					setModalOpened(false);

					if (embla) {
						if (lastWinner) {
							startTransition(() => {
								setConfiguration(prev => ({
									...prev,
									winners: [
										...(prev.winners ?? []),
										{
											participant: lastWinner,
											prize: prev.currentPrize,
										},
									],
									currentPrize: prev.currentPrize >= 0 ? prev.currentPrize - 1 : prev.currentPrize,
									participants: deleteWinners
										? prev.participants.filter(p => p.id !== lastWinner?.id)
										: prev.participants,
								}));
							});

							if (currentPrize <= 0) {
								router.push('/winners');
							}

							embla?.scrollTo(currentPrize >= 0 ? currentPrize : 0, true);
						}
					}
				}}
			/>
		</Stack>
	);
};
