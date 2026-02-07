'use client';

import type { ReactNode } from 'react';
import { ActionIcon, AppShell, Drawer, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings2 } from '@tabler/icons-react';

import { Configuration } from '../Configuration';
import { Logo } from '../logos/Logo';

export const AppLayout = ({ children }: { children: ReactNode }) => {
	const [drawerOpened, { toggle: toggleDrawer, close }] = useDisclosure();

	return (
		<AppShell classNames={{}}>
			<AppShell.Header
				bg='transparent'
				className='fixed top-0 h-15'
				px='xs'
				withBorder={false}
			>
				<Group
					className='h-full w-full'
					justify='space-between'
				>
					<Logo className='fixed top-12 left-13.25' />
					<ActionIcon.Group className='ml-auto'>
						<ActionIcon
							color='royal-blue'
							onClick={toggleDrawer}
							size='xl'
							variant='subtle'
						>
							<IconSettings2 />
						</ActionIcon>
					</ActionIcon.Group>
				</Group>
			</AppShell.Header>
			<AppShell.Main className='flex h-dvh flex-col overflow-hidden'>
				{children}
				<Drawer
					onClose={toggleDrawer}
					opened={drawerOpened}
					position='right'
					size={768}
					withCloseButton={false}
					classNames={{
						body: 'h-dvh',
					}}
				>
					<Configuration onSave={close} />
				</Drawer>
			</AppShell.Main>
		</AppShell>
	);
};
