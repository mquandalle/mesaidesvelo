<script>
	import { page } from '$app/stores';

	import Details from '$lib/components/Details.svelte';
	import PaneNavigation from '$lib/components/PaneNavigation.svelte';
	import ShareButton from '$lib/components/ShareButton.svelte';
	import { veloCat } from '$lib/stores';
	import { fly } from 'svelte/transition';
	import ExplanationsText from './ExplanationsText.svelte';
	import Results from './Results.svelte';

	/** @type {import('./$types').PageData */
	export let data;
	const ville = data.ville;

	$: veloCat.set($page.url?.searchParams.get('velo'));
</script>

<svelte:head>
	<title>Les aides vélo à {ville.nom} - MesAidesVélo</title>
	<meta
		name="description"
		content="Découvrez l’ensemble des aides à l’achat de vélo proposées à {ville.nom}. Simple, rapide et gratuit."
	/>
	<link rel="canonical" href="https://mesaidesvelo.fr/ville/{ville.slug}" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@bonforfait" />
	<meta property="og:title" content="Découvrez les aides à l’achat de vélo à {ville.nom}" />
	<meta
		property="og:image"
		content="https://mesaidesvelo.fr/ville/{ville.slug}/cover-sharing.png"
	/>
</svelte:head>

<div class="w-full max-w-screen-md m-auto">
	<div in:fly={{ y: 30 }}>
		<PaneNavigation depth={$veloCat ? 1 : 0}>
			{#if $veloCat}
				<Details />
			{:else}
				<Results />
			{/if}
		</PaneNavigation>
	</div>
	<ShareButton title="Toutes les aides vélo à {ville.nom}" />
	<ExplanationsText />
</div>
