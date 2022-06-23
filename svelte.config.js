import yaml from '@rollup/plugin-yaml';
import vercel from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import path from 'path';
import WindiCSS from 'vite-plugin-windicss';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [mdsvex()],
	extensions: ['.svelte', '.svx'],
	kit: {
		adapter: vercel(),
		vite: {
			plugins: [WindiCSS(), yaml()],
			resolve: {
				alias: {
					$entreprises: path.resolve('./data-fetch/entreprises/data')
				}
			}
		}
	}
};

export default config;
