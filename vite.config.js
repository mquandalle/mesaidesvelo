import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [tailwindcss(), sveltekit()],
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
