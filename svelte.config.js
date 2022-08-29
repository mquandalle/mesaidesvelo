import vercel from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [mdsvex()],
	extensions: ['.svelte', '.svx'],
	kit: {
		adapter: vercel(),
	},
};

export default config;
