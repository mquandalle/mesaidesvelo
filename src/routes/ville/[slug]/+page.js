import { browser } from '$app/env';
import { localisation } from '$lib/stores';
import { get } from 'svelte/store';

// This pattern is explained here:
// https://github.com/sveltejs/kit/issues/2851
export async function load({ params, fetch }) {
	if (browser && get(localisation)?.slug === params.slug) {
		return { ville: get(localisation) };
	} else {
		const res = await fetch(`/api/collectivites?slug=${params.slug}`);
		return { ville: await res.json() };
	}
}
