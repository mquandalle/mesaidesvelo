import yaml from '@rollup/plugin-yaml';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'node:path';
import WindiCSS from 'vite-plugin-windicss';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		WindiCSS({
			scan: {
				dirs: [path.resolve('./src'), path.resolve('./retrofit')],
				exclude: ['node_modules', '.git'],
				fileExtensions: ['svelte', 'ts', 'js', 'svx'],
			},
		}),
		yaml(),
	],
	resolve: {
		alias: {
			$entreprises: path.resolve('./data-fetch/entreprises/data'),
			$mav: path.resolve('./src'),
		},
	},
	test: {
		include: ['./tests/vitest.js'],
	},
	server: {
		fs: {
			allow: ['.'],
		},
	},
};

export default config;
