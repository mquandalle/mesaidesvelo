import { get } from 'svelte/store';
import { localisation } from '$lib/stores';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	const currentStore = get(localisation);
	if (currentStore?.slug === params.slug) {
		return { ville: currentStore };
	}
	const resServer = await fetch('/api/ville?slug=' + encodeURIComponent(params.slug));
	if (!resServer.ok) {
		throw error(404);
	}
	const ville = await resServer.json();
	localisation.set(ville);

	return { ville };
}
