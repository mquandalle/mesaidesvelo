<script>
	import { page } from '$app/stores';
	import Details from '$lib/components/Details.svelte';
	import Results from '$lib/components/Results.svelte';
	import { fly } from 'svelte/transition';
	import ShareButton from '$lib/components/ShareButton.svelte';
	import PaneNavigation from '$lib/components/PaneNavigation.svelte';

	/** @type {import('./$types').PageData */
	export let data;
	const ville = data.ville;
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
</div>
