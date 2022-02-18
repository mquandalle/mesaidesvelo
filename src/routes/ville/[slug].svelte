<script context="module">
	import { browser } from '$app/env';
	import { localisation } from '$lib/stores';

	// This pattern is explained here:
	// https://github.com/sveltejs/kit/issues/2851
	export async function load({ params, fetch }) {
		if (browser && get(localisation)?.slug === params.slug) {
			return { stuff: { ville: get(localisation) } };
		} else {
			const res = await fetch(`/api/collectivites?slug=${params.slug}`);
			return { stuff: { ville: await res.json() } };
		}
	}
</script>

<script>
	import { page } from '$app/stores';
	import Details from '$lib/components/Details.svelte';
	import Results from '$lib/components/Results.svelte';
	import { fly } from 'svelte/transition';
	import { get } from 'svelte/store';
	import ShareButton from '$lib/components/ShareButton.svelte';
	import PaneNavigation from '$lib/components/PaneNavigation.svelte';

	const ville = $page.stuff?.ville;
</script>

<svelte:head>
	<title>Les aides vélo à {ville.nom} - MesAidesVélo</title>
	<meta
		name="description"
		content="Découvrez l’ensemble des aides à l’achat ou la localisation de vélo proposées à {ville.nom}. Simple, rapide et gratuit."
	/>
</svelte:head>

<div class="w-full max-w-screen-md m-auto">
	<!-- In development mode, the transition isn't played the first time this
	page is shown. This is because the __layout.svelte component is entierly
	re-rendered. cf. https://github.com/sveltejs/kit/issues/2130-->
	<div class="grid overflow-hidden -m-4 p-4" in:fly|local={{ y: 30 }}>
		<PaneNavigation depth={$page.url.searchParams.get('velo') ? 1 : 0}>
			{#if $page.url.searchParams.get('velo')}
				<Details />
			{:else}
				<Results />
			{/if}
		</PaneNavigation>
	</div>
	<ShareButton title="Toutes les aides vélo à {ville.nom}" />
</div>
