import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	extensions: ['.svelte', '.svx'],
	kit: {
		adapter: vercel({
			runtime: 'nodejs22.x',
		}),
	},
};

export default config;
