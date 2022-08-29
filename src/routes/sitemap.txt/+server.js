import communes from '$lib/data/communes.json';
import { departementWithSlug } from '../departement/[slug]/+page.server';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	return new Response(
		[
			'/',
			'/prime-a-la-conversion',
			'/forfait-mobilite-durable',
			'/liste-aides',
			...departementWithSlug.map(({ slug }) => `/departement/${slug}`),
			...communes
				.sort((a, b) => b.population - a.population)
				.slice(0, 1000)
				.map(({ slug }) => `/ville/${slug}`)
		]
			.map((path) => `https://mesaidesvelo.fr${path}`)
			.join('\n')
	);
}
