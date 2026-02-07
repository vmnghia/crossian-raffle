import { useEffect } from 'react';
import { ActionIcon, Affix, Center, Modal, Stack, Text, Title } from '@mantine/core';
import { IconReload } from '@tabler/icons-react';
import type { Options } from 'canvas-confetti';
import { create } from 'canvas-confetti';

import { useConfiguration } from '@/contexts/Configuration';
import { PRIZES_DATA } from '@/data/prizes';
import type { Participant } from '@/types';

export const WinnerModal = ({
	winner,
	onClose,
	opened,
	onCancel,
}: {
	winner: Participant | null;
	onClose: () => void;
	opened: boolean;
	onCancel?: (lastWinner: Participant | null) => void;
}) => {
	const { configuration } = useConfiguration();
	const prize = configuration.currentPrize;

	useEffect(() => {
		const confettiCanvas = document.createElement('canvas');

		confettiCanvas.width = window.innerWidth;
		confettiCanvas.height = window.innerHeight;
		confettiCanvas.style.position = 'fixed';
		confettiCanvas.style.top = '0';
		confettiCanvas.style.left = '0';
		confettiCanvas.style.pointerEvents = 'none';
		confettiCanvas.style.zIndex = '1000';

		document.body.appendChild(confettiCanvas);
		const confetti = create(confettiCanvas, {
			resize: true,
		});

		const end = Date.now() + 5 * 1000;

		const colors = ['#bb0000', '#ffffff', '#ffdd00', '#003399', '#00bb00'];

		const prideConfetti = () => {
			confetti({
				particleCount: 2,
				angle: 60,
				spread: 64,
				origin: { x: 0, y: 0.75 },
				colors,
			});
			confetti({
				particleCount: 2,
				angle: 120,
				spread: 64,
				origin: { x: 1, y: 0.75 },
				colors,
			});

			if (Date.now() < end) {
				requestAnimationFrame(prideConfetti);
			}
		};

		const fireConfetti = (particleRatio: number, opts: Options) => {
			confetti({
				origin: { y: 0.7 },
				...opts,
				particleCount: Math.floor(150 * particleRatio),
			});
		};

		if (opened) {
			prideConfetti();
			fireConfetti(0.25, {
				spread: 26,
				startVelocity: 55,
			});
			fireConfetti(0.2, {
				spread: 60,
			});
			fireConfetti(0.35, {
				spread: 100,
				decay: 0.91,
				scalar: 0.8,
			});
			fireConfetti(0.1, {
				spread: 120,
				startVelocity: 25,
				decay: 0.92,
				scalar: 1.2,
			});
			fireConfetti(0.1, {
				spread: 120,
				startVelocity: 45,
			});
		}

		return () => {
			document.body.removeChild(confettiCanvas);
		};
	}, [opened]);

	return (
		<Modal
			centered
			onClose={onClose}
			opened={opened}
			padding={0}
			size={1024}
			withCloseButton={false}
			classNames={{
				body: 'h-full text-white',
				content: 'overflow-visible bg-transparent',
			}}
			overlayProps={{
				blur: 5,
			}}
		>
			<Center
				bg="url('/images/winner-modal-bg.png') no-repeat center/100% 100%"
				className='h-133.5 w-full p-8'
			>
				<Stack
					align='center'
					gap='xl'
				>
					<Title
						className='font-inter mb-8 text-5xl font-bold'
						order={1}
					>
						Congratulations!
					</Title>
					<Text
						c='amber.2'
						className='text-center text-5xl font-bold'
					>
						{`${winner?.name} - ${winner?.coe}`}
					</Text>
					<Text
						c='amber'
						className='font-monda mt-4 text-4xl font-semibold'
					>
						{prize !== undefined ? PRIZES_DATA[prize]?.title : ''}:
					</Text>
					<Text className='font-monda text-3xl'>{prize !== undefined ? PRIZES_DATA[prize]?.name : ''}</Text>
				</Stack>
			</Center>
			<Affix>
				<ActionIcon
					color='white'
					size='xl'
					variant='subtle'
					onClick={() => {
						onCancel?.(winner);
					}}
				>
					<IconReload size='80%' />
				</ActionIcon>
			</Affix>
		</Modal>
	);
};
