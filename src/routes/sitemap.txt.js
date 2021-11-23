// Un sitemap avec les 50 villes les plus peuplées
import communes from '$lib/data-communes';
import { slugify } from '$lib/utils';

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
