// Un sitemap avec les 50 villes les plus peuplées
import { slugify } from '$lib/utils';
import communes from '$lib/data/communes.json';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {
	return new Response(
		[
			'/',
			'/prime-a-la-conversion',
			...communes
				.sort((a, b) => b.population - a.population)
				.slice(0, 50)
				.map(({ nom }) => `/ville/${slugify(nom)}`)
		]
			.map((path) => `https://mesaidesvelo.fr${path}`)
			.join('\n')
	);
}
