import yaml from '@rollup/plugin-yaml';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'node:path';
import WindiCSS from 'vite-plugin-windicss';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), WindiCSS(), yaml()],
	resolve: {
		alias: {
			$entreprises: path.resolve('./data-fetch/entreprises/data')
		}
	}
};

export default config;
