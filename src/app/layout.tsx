import { Box, ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import type { Metadata } from 'next';
import { Monda, Poppins, Rakkas } from 'next/font/google';

import Flower from './flower.svg';
import LeftDecor from './left.svg';
import RightDecor from './right.svg';

import '@/app/globals.css';
import '@mantine/carousel/styles.layer.css';
import '@mantine/core/styles.layer.css';
import { AppLayout } from '@/components/AppLayout';
import { ConfigurationProvider } from '@/contexts/Configuration/Configuration';
import { theme } from '@/theme';

const rakkas = Rakkas({
	variable: '--font-rakkas',
	subsets: ['latin'],
	weight: ['400'],
});

const monda = Monda({
	variable: '--font-monda',
	subsets: ['latin'],
});

const poppins = Poppins({
	variable: '--font-poppins',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
	title: 'Crossian',
	description: 'Employee Appreciation Gala 2026',
};

const RootLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<html
			lang='en'
			{...mantineHtmlProps}
		>
			<head>
				<ColorSchemeScript defaultColorScheme='dark' />
			</head>
			<body className={`${rakkas.variable} ${monda.variable} ${poppins.variable} font-sans antialiased`}>
				<ConfigurationProvider>
					<MantineProvider
						defaultColorScheme='dark'
						theme={theme}
					>
						<AppLayout>
							<Box
								bg='linear-gradient(180deg,var(--mantine-color-royal-blue-9) 0%, var(--mantine-color-royal-blue-5) 100%)'
								className='relative flex min-h-0 w-full grow flex-col pt-15 pb-24 text-white'
							>
								<LeftDecor className='fixed -bottom-2 left-0' />
								<RightDecor className='fixed right-0 bottom-0' />
								<Flower className='fixed top-0 left-0 z-99 opacity-75' />
								{children}
							</Box>
						</AppLayout>
					</MantineProvider>
				</ConfigurationProvider>
			</body>
		</html>
	);
};

export default RootLayout;
