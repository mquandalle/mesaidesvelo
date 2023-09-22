import { mdsvex } from 'mdsvex';
import nodeAdapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [mdsvex()],
	extensions: ['.svelte', '.svx'],
	kit: {
		adapter: nodeAdapter(),
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
