import vercel from '@sveltejs/adapter-vercel';
import WindiCSS from 'vite-plugin-windicss';
import yaml from '@rollup/plugin-yaml';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [mdsvex()],
	extensions: ['.svelte', '.svx'],
	kit: {
		adapter: vercel(),
		target: '#svelte',
		vite: {
			plugins: [WindiCSS(), yaml()]
		}
	}
};

export default config;
