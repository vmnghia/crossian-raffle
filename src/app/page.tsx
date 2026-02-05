import { Box, Center, Grid, GridCol, Stack, Text, Title } from '@mantine/core';

import Flower from './flower.svg';
import LeftDecor from './left.svg';
import RightDecor from './right1.svg';

import { PrizeImage } from '@/components/PrizeImage';
import { Raffle } from '@/components/Raffle';

const Home = () => {
	return (
		<Box
			bg='linear-gradient(180deg,rgba(105, 0, 22, 1) 0%, rgba(196, 72, 47, 1) 100%)'
			className='relative flex min-h-0 w-full grow flex-col pt-15 pb-24 text-white'
		>
			<LeftDecor className='fixed bottom-0 left-0' />
			<RightDecor className='fixed right-0 bottom-0' />
			<Flower className='fixed top-0 left-0 z-101' />
			<Text className='font-monda mb-8 text-center text-3xl font-semibold tracking-widest text-shadow-lg/30'>
				EMPLOYEE APRECIATION GALA 2026
			</Text>
			<Title
				c='amber.3'
				className='text-center text-shadow-lg'
				size={56}
			>
				LUCKY DRAW
			</Title>
			<Grid
				align='center'
				classNames={{ root: 'size-full flex-1 flex flex-col', inner: 'flex-1' }}
				columns={9}
				grow
				justify='center'
			>
				<GridCol span={4}>
					<Center>
						<PrizeImage />
					</Center>
				</GridCol>
				<GridCol span={5}>
					<Stack
						align='center'
						className='mt-16 size-full px-16'
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
