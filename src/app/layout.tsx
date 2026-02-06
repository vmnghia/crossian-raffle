import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import type { Metadata } from 'next';
import { Inter, Monda, Poppins } from 'next/font/google';

import '@/app/globals.css';
import '@mantine/carousel/styles.layer.css';
import '@mantine/core/styles.layer.css';
import { AppLayout } from '@/components/AppLayout';
import { ConfigurationProvider } from '@/contexts/Configuration/Configuration';
import { theme } from '@/theme';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
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
			<body className={`${inter.variable} ${monda.variable} ${poppins.variable} font-sans antialiased`}>
				<ConfigurationProvider>
					<MantineProvider
						defaultColorScheme='dark'
						theme={theme}
					>
						<AppLayout>{children}</AppLayout>
					</MantineProvider>
				</ConfigurationProvider>
			</body>
		</html>
	);
};

export default RootLayout;
