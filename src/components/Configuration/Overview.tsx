import { Fragment } from 'react/jsx-runtime';
import { ActionIcon, Grid, Popover, Text, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { countBy, sortBy } from 'lodash-es';

import { useFormContext } from './form';
import { WinnerList } from './WinnerList';

export const Overview = () => {
	const form = useFormContext();
	const participants = form.getValues().participants;

	const counts = countBy(
		participants.filter(p => p.coe),
		'coe'
	);

	return (
		<Popover
			closeOnClickOutside={false}
			position='bottom'
			shadow='md'
			width={360}
			withArrow
		>
			<Popover.Target>
				<Tooltip label='Overview'>
					<ActionIcon variant='subtle'>
						<IconInfoCircle size='70%' />
					</ActionIcon>
				</Tooltip>
			</Popover.Target>
			<Popover.Dropdown>
				<Grid
					columns={4}
					gutter={4}
				>
					<Grid.Col span={3}>
						<Text
							c='blue'
							fw={600}
						>
							Total Participants:
						</Text>{' '}
					</Grid.Col>
					<Grid.Col span={1}>
						<Text className='text-right font-semibold'>{participants.length}</Text>
					</Grid.Col>
					{sortBy(Object.entries(counts), ([coe]) => coe).map(([coe, count]) => (
						<Fragment key={coe}>
							<Grid.Col
								c='blue'
								span={3}
							>
								{coe || 'N/A'}:{' '}
							</Grid.Col>
							<Grid.Col span={1}>
								<Text className='text-right'>{count}</Text>
							</Grid.Col>
						</Fragment>
					))}
				</Grid>
				<WinnerList />
			</Popover.Dropdown>
		</Popover>
	);
};
