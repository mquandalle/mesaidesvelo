import { browser } from '$app/env';
import { localisation } from '$lib/stores';
import { get } from 'svelte/store';

// This pattern is explained here:
// https://github.com/sveltejs/kit/issues/2851
/** @type {import('./$types').PageLoad} */
export async function load({ params, url, fetch, data }) {
	const veloCat = url.searchParams.get('velo') ?? null;

	if (browser && get(localisation)?.slug === params.slug) {
		return { ...data, veloCat, ville: get(localisation) };
	} else {
		const res = await fetch(`/api/collectivites?slug=${params.slug}`);
		return { ...data, veloCat, ville: await res.json() };
	}
}
