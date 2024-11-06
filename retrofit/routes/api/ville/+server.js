import { data } from '@betagouv/aides-velo';
import { error } from '@sveltejs/kit';
import { rawCityToFullLocalisation } from '$lib/utils';

export function GET({ url }) {
	const slug = url.searchParams.get('slug');
	const ville = data.communes.find((v) => v.slug === slug);
	if (!ville) {
		error(404);
	}

	return new Response(JSON.stringify(rawCityToFullLocalisation(ville)), {
		headers: { 'Content-Type': 'application/json' },
	});
}
