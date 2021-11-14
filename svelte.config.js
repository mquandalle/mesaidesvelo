import vercel from '@sveltejs/adapter-vercel';
import WindiCSS from 'vite-plugin-windicss';
import yaml from '@rollup/plugin-yaml';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: vercel(),
		target: '#svelte',
		vite: {
			plugins: [WindiCSS(), yaml()]
		}
	}
};

export default config;
