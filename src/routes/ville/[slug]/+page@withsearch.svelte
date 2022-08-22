<script>
	import { page } from '$app/stores';
	import Details from '$lib/components/Details.svelte';
	import PaneNavigation from '$lib/components/PaneNavigation.svelte';
	import ShareButton from '$lib/components/ShareButton.svelte';
	import { fly } from 'svelte/transition';
	import Results from './Results.svelte';
	import SeoText from './SEOText.svelte';

	/** @type {import('./$types').PageData */
	export let data;
	const ville = data.ville;
</script>

<svelte:head>
	<title>Les aides vélo à {ville.nom} - MesAidesVélo</title>
	<meta
		name="description"
		content="Découvrez l’ensemble des aides à l’achat de vélo proposées à {ville.nom}. Simple, rapide et gratuit."
	/>
	<link rel="canonical" href="https://mesaidesvelo.fr/ville/{ville.slug}" />
</svelte:head>

<div class="w-full max-w-screen-md m-auto">
	<div in:fly|local={{ y: 30 }}>
		<PaneNavigation depth={$page.url.searchParams.get('velo') ? 1 : 0}>
			{#if $page.url.searchParams.get('velo')}
				<Details />
			{:else}
				<Results />
			{/if}
		</PaneNavigation>
	</div>
	<ShareButton title="Toutes les aides vélo à {ville.nom}" />
	<SeoText />
</div>
