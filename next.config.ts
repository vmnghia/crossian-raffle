import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	typedRoutes: true,
	turbopack: {
		rules: {
			'*.svg': {
				loaders: [
					{
						loader: '@svgr/webpack',
						options: {
							typescript: true,
							svgo: false,
							memo: true,
						},
					},
				],
				as: '*.js',
			},
		},
	},
	reactCompiler: true,
	experimental: {
		optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@mantine/form', '@tabler/icons-react'],
		turbopackFileSystemCacheForBuild: true,
		cssChunking: 'strict',
	},
	output: process.env.OUTPUT as 'standalone' | 'export' | undefined,
};

export default nextConfig;
