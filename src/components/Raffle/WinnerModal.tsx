import { useEffect } from 'react';
import { Center, Modal, Stack, Text, Title } from '@mantine/core';
import type { Options } from 'canvas-confetti';
import { create } from 'canvas-confetti';
import { capitalize } from 'lodash-es';

import type { Prize } from '@/contexts/Configuration';

const prizesData = {
	consolation: {
		name: 'AirPods Pro',
	},
	second: {
		name: 'Apple Watch',
	},
	first: {
		name: 'iPad Air',
	},
	grand: {
		name: 'MacBook Pro',
	},
};

const count = 200;
const defaults = {
	origin: { y: 0.5 },
};

export const WinnerModal = ({
	winner,
	onClose,
	opened,
	prize,
}: {
	winner: string;
	onClose: () => void;
	opened: boolean;
	prize?: Prize;
}) => {
	useEffect(() => {
		const myCanvas = document.createElement('canvas');

		myCanvas.width = window.innerWidth;
		myCanvas.height = window.innerHeight;
		myCanvas.style.position = 'fixed';
		myCanvas.style.top = '0';
		myCanvas.style.left = '0';
		myCanvas.style.pointerEvents = 'none';
		myCanvas.style.zIndex = '1000';

		document.body.appendChild(myCanvas);
		const confetti = create(myCanvas, {
			resize: true,
		});

		const end = Date.now() + 10 * 1000;

		const colors = ['#bb0000', '#ffffff', '#ffdd00', '#003399', '#00bb00'];

		const firework = () => {
			confetti({
				particleCount: 2,
				angle: 60,
				spread: 55,
				origin: { x: 0, y: 0.7 },
				colors,
			});
			confetti({
				particleCount: 2,
				angle: 120,
				spread: 55,
				origin: { x: 1, y: 0.7 },
				colors,
			});

			if (Date.now() < end) {
				requestAnimationFrame(firework);
			}
		};

		const fire = (particleRatio: number, opts: Options) => {
			confetti({
				...defaults,
				...opts,
				particleCount: Math.floor(count * particleRatio),
			});
		};

		if (opened) {
			firework();
			fire(0.25, {
				spread: 26,
				startVelocity: 55,
			});
			fire(0.2, {
				spread: 60,
			});
			fire(0.35, {
				spread: 100,
				decay: 0.91,
				scalar: 0.8,
			});
			fire(0.1, {
				spread: 120,
				startVelocity: 25,
				decay: 0.92,
				scalar: 1.2,
			});
			fire(0.1, {
				spread: 120,
				startVelocity: 45,
			});
		} else {
			document.body.removeChild(myCanvas);
		}
	}, [opened]);

	return (
		<Modal
			centered
			onClose={onClose}
			opened={opened}
			padding={0}
			size={744}
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
				bg="url('/images/winner-modal-bg.png')"
				className='h-97 w-full p-8'
			>
				<Stack
					align='center'
					gap='xl'
				>
					<Title
						fw='medium'
						order={1}
					>
						Congratulations!
					</Title>
					<Text
						c='amber.2'
						className='text-5xl font-bold'
					>
						{winner}
					</Text>
					{prize ? (
						<Text size='lg'>
							<b>{capitalize(prize)} prize: </b>
							{prizesData[prize].name}
						</Text>
					) : null}
				</Stack>
			</Center>
		</Modal>
	);
};
