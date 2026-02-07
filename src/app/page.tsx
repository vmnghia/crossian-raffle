import { Center, Grid, GridCol, Stack, Text, Title } from '@mantine/core';

import { PrizeImage } from '@/components/PrizeImage';
import { Raffle } from '@/components/Raffle';

const Home = () => {
	return (
		<>
			<Text
				c='#EBE2B7'
				className='font-monda mb-8 text-center text-3xl font-semibold tracking-widest text-shadow-lg/30'
			>
				EMPLOYEE APPRECIATION GALA 2026
			</Text>
			<Title
				c='amber.3'
				className='font-rakkas text-center font-normal text-shadow-lg'
				ff='var(--font-rakkas)'
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
		</>
	);
};

export default Home;
