import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	extensions: ['.svelte', '.svx'],
	kit: {
		adapter: vercel(),
		files:
			process.env.VITE_SITE === 'aideretrofit.fr'
				? {
						routes: 'retrofit/routes',
						appTemplate: 'retrofit/app.html',
						lib: 'src/lib',
						assets: 'retrofit/static',
					}
				: {},
		outDir: `.svelte-kit/${process.env.VITE_SITE}`,
	},
};

export default config;
