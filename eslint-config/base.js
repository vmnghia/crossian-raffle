import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import commentsConfig from './configs/comments.js';
import { ECMA_VERSION } from './constants.js';
import bestPracticeRules from './rules/best-practice.js';
import es6Rules from './rules/es6.js';
import importRules from './rules/import.js';
import possibleErrorsRules from './rules/possible-errors.js';
import stylisticRules from './rules/stylistic.js';
import variablesRules from './rules/variables.js';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
	js.configs.recommended,
	importPlugin.flatConfigs.recommended,
	importPlugin.flatConfigs.typescript,
	eslintConfigPrettier,
	...tseslint.configs.recommended,
	bestPracticeRules,
	...commentsConfig,
	es6Rules,
	importRules,
	possibleErrorsRules,
	stylisticRules,
	variablesRules,
	{
		linterOptions: {
			reportUnusedDisableDirectives: true,
		},
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		ignores: ['!.*.js'],
		settings: {
			// Use the Node resolver by default.
			'import/resolver': { node: {}, typescript: {} },
		},
		languageOptions: {
			globals: {
				...globals[`es${ECMA_VERSION}`],
			},
			parserOptions: {
				ecmaVersion: ECMA_VERSION,
				sourceType: 'module',
			},
		},
	},
	{
		ignores: ['dist/**', '*.config.mjs', '*.config.js', '*.config.ts'],
	},
	{
		files: [
			'*.config.cjs',
			'*.config.js',
			'*.config.mjs',
			'*.config.ts',
			'**/*.d.ts',
			'**/*.stories.ts',
			'**/*.stories.tsx',
			'app/**/*error.tsx',
			'app/**/layout.tsx',
			'app/**/not-found.tsx',
			'app/**/opengraph-image.tsx',
			'app/**/page.tsx',
			'app/apple-icon.tsx',
			'app/robots.ts',
			'app/sitemap.ts',
			'next.config.mjs',
			'src/app/**/*error.tsx',
			'src/app/**/layout.tsx',
			'src/app/**/not-found.tsx',
			'src/app/**/opengraph-image.tsx',
			'src/app/**/page.tsx',
			'src/app/apple-icon.tsx',
			'src/app/robots.ts',
			'src/app/sitemap.ts',
		],
		rules: {
			'import/no-default-export': 'off',
			'import/prefer-default-export': ['error', { target: 'any' }],
			'import/no-cycle': 'off', // This rule is the most taxing on performance,
		},
	},
	{
		rules: {
			'@typescript-eslint/consistent-type-imports': 'error',
		},
	},
];
