// Un sitemap avec les 50 villes les plus peuplées
import { loadJsonFile } from '$lib/readWriteJson';
import { slugify } from '$lib/utils';

const communes = loadJsonFile('src/data/communes.json');

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({}) {
	return {
		body: [
			'/',
			...communes
				.sort((a, b) => b.population - a.population)
				.slice(0, 50)
				.map(({ nom }) => `/ville/${slugify(nom)}`)
		]
			.map((path) => `https://mesaidesvelo.fr${path}`)
			.join('\n')
	};
}
