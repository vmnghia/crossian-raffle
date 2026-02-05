import { Text } from '@mantine/core';

import { useConfiguration } from '@/contexts/Configuration';

export const WinnerList = () => {
	const { configuration } = useConfiguration();

	return (
		<div>
			<Text
				fw={600}
				size='md'
			>
				Winner
			</Text>
			{configuration.winners?.map(winner => (
				<Text key={winner.participant.id}>
					{winner.participant.name} - {winner.participant.coe}: {winner.prize}
				</Text>
			))}
		</div>
	);
};
