// Un sitemap avec les 50 villes les plus peuplées
import communes from '@etalab/decoupage-administratif/data/communes.json';
import { slugify } from '$lib/utils';

const data = communes.filter(
	(c) =>
		c.type === 'commune-actuelle' && c.codesPostaux && c.population && !c.code?.startsWith('97')
);

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({}) {
	return {
		body: [
			'/',
			...data
				.sort((a, b) => b.population - a.population)
				.slice(0, 50)
				.map(({ nom }) => `/ville/${slugify(nom)}`)
		]
			.map((path) => `https://mesaidesvelo.fr${path}`)
			.join('\n')
	};
}
