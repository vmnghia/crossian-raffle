import type { RefObject } from 'react';
import { ActionIcon, Button, FileButton, Group, Tooltip } from '@mantine/core';
import { IconArrowsShuffle2, IconDownload, IconPlus, IconUpload } from '@tabler/icons-react';
import { shuffle } from 'lodash-es';
import Papa, { unparse } from 'papaparse';
import { v4 } from 'uuid';

import { COES } from './constants';
import { useFormContext } from './form';
import { Overview } from './Overview';

import { defaultConfig, useConfiguration } from '@/contexts/Configuration';
import type { COE } from '@/types';

interface ParticipantCSV {
	Name: string;
	COE?: string;
}

export const Actions = ({ participantsListRef }: { participantsListRef: RefObject<HTMLDivElement | null> }) => {
	const { configuration, reset } = useConfiguration();

	const form = useFormContext();

	const handleDownloadCSV = () => {
		const csv = unparse(
			configuration?.participants.map(p => ({
				Name: p.name,
				COE: p.coe || '',
			})) || [],
			{
				columns: ['Name', 'COE'],
			}
		);

		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');

		link.href = url;
		link.download = 'participants.csv';
		link.click();
		URL.revokeObjectURL(url);
	};

	const handleAddParticipant = () => {
		form.insertListItem('participants', { id: v4(), name: '' });
		setTimeout(() => {
			participantsListRef.current?.scrollTo({
				top: participantsListRef.current.scrollHeight,
				behavior: 'instant',
			});
			setTimeout(() => {
				document
					.querySelector<HTMLInputElement>(
						`[data-path='participants.${form.getValues().participants.length - 1}.name']`
					)
					?.focus();
			}, 100);
		}, 100);
	};

	const handleUploadCSV = (file: File | null) => {
		if (file) {
			Papa.parse<ParticipantCSV>(file, {
				complete: ({ data }) => {
					const participants = data.map(row => ({
						name: row.Name,
						coe: row.COE && COES.includes(row.COE.toUpperCase() as COE) ? (row.COE.toUpperCase() as COE) : undefined,
						id: v4(),
					}));

					form.setFieldValue('participants', participants);
				},
				header: true,
			});
		}
	};

	return (
		<Group className='ml-auto'>
			<Button
				onClick={() => {
					reset();
					form.setValues(defaultConfig);
				}}
			>
				Reset
			</Button>
			<ActionIcon.Group>
				<Overview />
				<Tooltip label='Add Participant'>
					<ActionIcon
						color='green'
						onClick={handleAddParticipant}
						variant='subtle'
					>
						<IconPlus size='70%' />
					</ActionIcon>
				</Tooltip>
				<Tooltip label='Shuffle Participants'>
					<ActionIcon
						color='dark'
						variant='subtle'
						onClick={() => {
							form.setValues(({ participants }) => ({
								participants: shuffle(participants),
							}));
						}}
					>
						<IconArrowsShuffle2 size='70%' />
					</ActionIcon>
				</Tooltip>
				<FileButton
					accept='text/csv'
					onChange={handleUploadCSV}
				>
					{props => (
						<Tooltip label='Upload CSV'>
							<ActionIcon
								{...props}
								color='crossian'
								variant='subtle'
							>
								<IconUpload size='70%' />
							</ActionIcon>
						</Tooltip>
					)}
				</FileButton>
				<Tooltip label='Download CSV'>
					<ActionIcon
						color='crossian'
						onClick={handleDownloadCSV}
						variant='subtle'
					>
						<IconDownload size='70%' />
					</ActionIcon>
				</Tooltip>
			</ActionIcon.Group>
		</Group>
	);
};
