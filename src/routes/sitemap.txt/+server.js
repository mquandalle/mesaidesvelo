// Un sitemap avec les villes les plus peuplées
import communes from '$lib/data/communes.json';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	return new Response(
		[
			'/',
			'/prime-a-la-conversion',
			'/forfait-mobilite-durable',
			'/liste-aides',
			...communes
				.sort((a, b) => b.population - a.population)
				.slice(0, 1000)
				.map(({ slug }) => `/ville/${slug}`)
		]
			.map((path) => `https://mesaidesvelo.fr${path}`)
			.join('\n')
	);
}
