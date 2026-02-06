'use client';

import type { ChangeEvent } from 'react';
import { useMemo, useRef, useState } from 'react';
import {
	ActionIcon,
	Button,
	Checkbox,
	Fieldset,
	Group,
	InputWrapper,
	Paper,
	ScrollArea,
	Select,
	Slider,
	TextInput,
	Title,
} from '@mantine/core';
import { isNotEmpty } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { sample, shuffle } from 'lodash-es';
import { compressToUTF16 } from 'lz-string';
import { v4 } from 'uuid';

import { Actions } from './Actions';
import { COES } from './constants';
import { FormProvider, useForm } from './form';

import type { ConfigurationData } from '@/contexts/Configuration';
import { useConfiguration } from '@/contexts/Configuration';
import type { COE, Participant } from '@/types';

const getPreordainedWinners = (
	participants: Participant[],
	prizeDistribution: {
		[key in COE]?: number;
	}
): Participant[] => {
	const winners: Participant[] = [];
	const distributionCOEs = Object.keys(prizeDistribution) as COE[];

	// Get winners based on prizeDistribution for each COE
	distributionCOEs.forEach(coe => {
		const count = prizeDistribution[coe] ?? 0;
		const coeParticipants = participants.filter(p => p.coe === coe);
		const shuffledCoeParticipants = shuffle(coeParticipants);
		const selected = shuffledCoeParticipants.slice(0, Math.min(count, shuffledCoeParticipants.length));

		winners.push(...selected);
	});

	// If total winners < 10, fill from remaining COEs (at most 1 per COE)
	if (winners.length < 10) {
		const otherCOEs = COES.filter(coe => !distributionCOEs.includes(coe));
		const shuffledOtherCOEs = shuffle(otherCOEs);

		// Get at most 1 winner from each remaining COE
		for (const coe of shuffledOtherCOEs) {
			if (winners.length >= 10) break;

			const coeParticipants = participants.filter(p => p.coe === coe && !winners.some(w => w.id === p.id));

			if (coeParticipants.length > 0) {
				const randomParticipant = sample(coeParticipants);

				if (randomParticipant) {
					winners.push(randomParticipant);
				}
			}
		}
	}

	return shuffle(winners);
};

export const Configuration = ({ onSave }: { onSave?: () => void }) => {
	const { configuration, setConfiguration } = useConfiguration();
	const { participants = [], deleteWinners = false, spinTime = 5000, winners = [], currentPrize = 9 } = configuration;
	const [search, setSearch] = useState('');
	const [coeFilter, setCOEFilter] = useState<string | null>(null);
	const [debouncedSearch] = useDebouncedValue(search, 200);
	const participantsListRef = useRef<HTMLDivElement>(null);

	const form = useForm({
		initialValues: {
			participants: participants.length
				? participants
				: [
						{
							id: v4(),
							name: '',
						},
					],
			deleteWinners,
			spinTime,
			winners,
			currentPrize,
			preordainedWinners: [],
			prideConfettiDuration: 7500,
		},
		mode: 'uncontrolled',
		validateInputOnChange: true,
		validate: {
			participants: {
				coe: isNotEmpty('COE is required'),
				name: isNotEmpty('Name is required'),
			},
		},
	});

	const formParticipants = useMemo(() => {
		return form
			.getValues()
			.participants.map((participant, index) => ({ ...participant, index }))
			.filter(participant => {
				return (
					participant.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
					(!coeFilter || !participant.coe || coeFilter === participant.coe)
				);
			});
	}, [coeFilter, debouncedSearch, form]);

	// eslint-disable-next-line react-hooks/incompatible-library -- will remove when the library is updated
	const rowVirtualizer = useVirtualizer({
		count: formParticipants.length,
		getScrollElement: () => participantsListRef.current,
		estimateSize: () => 36,
		overscan: 10,
	});

	const fields = useMemo(
		() =>
			rowVirtualizer.getVirtualItems().map(({ index: virtualIndex, start, size }) => {
				const { id, name, index } = formParticipants[virtualIndex] || {};

				return (
					<Group
						key={id}
						align='flex-start'
						className='absolute'
						gap={4}
						hidden={Boolean(name && !name.toLowerCase().includes(debouncedSearch.toLowerCase()))}
						style={{
							transform: `translateY(${start}px)`,
							height: size,
						}}
					>
						<TextInput
							key={form.key(`participants.${index}.name`)}
							placeholder='Name'
							size='xs'
							w={256}
							{...form.getInputProps(`participants.${index}.name`)}
						/>
						<Select
							key={form.key(`participants.${index}.coe`)}
							data={COES}
							placeholder='COE'
							size='xs'
							w={112}
							{...form.getInputProps(`participants.${index}.coe`)}
						/>
						<ActionIcon
							className='ml-auto'
							color='red'
							onClick={() => form.removeListItem('participants', index)}
							variant='subtle'
						>
							<IconX size={16} />
						</ActionIcon>
					</Group>
				);
			}),
		[debouncedSearch, form, formParticipants, rowVirtualizer]
	);

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearch(e.currentTarget.value);
	};

	const handleSubmit = (values: typeof form.values) => {
		const newConfiguration: ConfigurationData = {
			...values,
			preordainedWinners: values.preordainedWinners.length
				? values.preordainedWinners
				: getPreordainedWinners(values.participants, {
						CPM: 3,
						'TECH.PMI': 2,
						CEE: 2,
					}),
		};

		setConfiguration(newConfiguration);
		window.localStorage.setItem('configuration', compressToUTF16(JSON.stringify(newConfiguration)));

		onSave?.();
	};

	return (
		<>
			<Title
				className='mb-4'
				order={3}
			>
				Configuration
			</Title>
			<FormProvider form={form}>
				<form
					className='h-full max-h-[calc(100%-200px)]'
					onSubmit={form.onSubmit(handleSubmit)}
				>
					<Fieldset
						className='relative h-full'
						legend='Participants'
					>
						<Group
							align='flex-start'
							className='mb-4'
						>
							<Group
								align='flex-start'
								gap={4}
							>
								<TextInput
									mb='sm'
									onChange={handleSearchChange}
									placeholder='Participant Name'
									rightSection={<IconSearch size={16} />}
									size='sm'
									value={search}
									variant='default'
									w={256}
								/>
								<Select
									checkIconPosition='right'
									className='w-36'
									clearable
									data={COES}
									onChange={setCOEFilter}
									placeholder='Select COE'
									size='sm'
									value={coeFilter}
									variant='default'
									withScrollArea={false}
								/>
							</Group>

							<Actions participantsListRef={participantsListRef} />
						</Group>
						<ScrollArea.Autosize
							className='max-h-[calc(100%-96px)] min-h-10'
							scrollbarSize={10}
							scrollHideDelay={100}
							viewportRef={participantsListRef}
							classNames={{
								content: 'relative',
							}}
							styles={{
								content: {
									height: rowVirtualizer.getTotalSize(),
								},
							}}
						>
							{fields}
						</ScrollArea.Autosize>
					</Fieldset>
					<InputWrapper
						className='mt-4'
						label={`Spin Time: ${form.getValues().spinTime / 1000} seconds`}
					>
						<Slider
							className='my-2 w-120'
							label={null}
							max={30000}
							min={2000}
							onChange={value => form.setFieldValue('spinTime', value)}
							size='lg'
							step={500}
							thumbSize={20}
							value={form.getValues().spinTime}
						/>
					</InputWrapper>
					<InputWrapper
						className='mt-4'
						label={`Confetti Duration: ${form.getValues().prideConfettiDuration / 1000} seconds`}
					>
						<Slider
							className='my-2 w-120'
							color='scarlet'
							label={null}
							max={15000}
							min={1000}
							onChange={value => form.setFieldValue('prideConfettiDuration', value)}
							size='lg'
							step={500}
							thumbSize={20}
							value={form.getValues().prideConfettiDuration}
						/>
					</InputWrapper>
					<Checkbox
						label='Delete winners from participants list'
						{...form.getInputProps('deleteWinners', { type: 'checkbox' })}
					/>
					<Paper className='sticky bottom-0 z-10 py-4'>
						<Button
							size='lg'
							type='submit'
						>
							Save
						</Button>
					</Paper>
				</form>
			</FormProvider>
		</>
	);
};
