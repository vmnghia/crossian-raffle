import { Box, Center, Grid, GridCol, Stack, Text, Title } from '@mantine/core';
import { Martel } from 'next/font/google';

import Flower from './flower.svg';
import LeftDecor from './left.svg';
import RightDecor from './right1.svg';

import { PrizeImage } from '@/components/PrizeImage';
import { Raffle } from '@/components/Raffle';

const martel = Martel({
	subsets: ['latin'],
	weight: ['400', '700'],
});

const Home = () => {
	return (
		<Box
			bg='linear-gradient(180deg,var(--mantine-color-royal-blue-9) 0%, var(--mantine-color-royal-blue-5) 100%)'
			className='relative flex min-h-0 w-full grow flex-col pt-15 pb-24 text-white'
		>
			<LeftDecor className='fixed bottom-0 left-0' />
			<RightDecor className='fixed right-0 bottom-0' />
			<Flower className='fixed top-0 left-0 z-99' />
			<Text
				c='#EBE2B7'
				className='font-monda mb-8 text-center text-3xl font-semibold tracking-widest text-shadow-lg/30'
			>
				EMPLOYEE APPRECIATION GALA 2026
			</Text>
			<Title
				c='amber.3'
				className={`text-center font-bold text-shadow-lg ${martel.className}`}
				size={64}
			>
				LUCKY DRAW
			</Title>
			<Grid
				align='center'
				classNames={{ root: 'size-full flex-1 flex flex-col', inner: 'flex-1' }}
				columns={7}
				grow
				justify='center'
			>
				<GridCol span={3}>
					<Center>
						<PrizeImage />
					</Center>
				</GridCol>
				<GridCol span={4}>
					<Stack
						align='center'
						className='mt-16 size-full pr-24'
						justify='center'
					>
						<Raffle />
					</Stack>
				</GridCol>
			</Grid>
		</Box>
	);
};

export default Home;
