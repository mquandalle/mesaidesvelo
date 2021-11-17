<script context="module">
	export const ssr = false;
</script>

<script>
	import { page } from '$app/stores';
	import { localisation } from '$lib/stores/localisation';

	import { onMount } from 'svelte';

	onMount(async () => {
		// TODO: investigate better way to load this data from the server if
		// we need it and from the client if we already got
		// it from the search field results
		if ($page.params.slug !== $localisation?.slug) {
			const res = await fetch(`/api/collectivites?slug=${$page.params.slug}`);
			if (res.ok) {
				localisation.set(await res.json());
			}
		}
	});
</script>

<svelte:head>
	{#if $localisation}
		<title>Les aides vélo à {$localisation.nom} - MesAidesVélo</title>
		<meta
			name="description"
			content="Découvrez l’ensemble des aides à l’achat ou la localisation de vélo proposées à {$localisation.nom}. Simple, rapide et gratuit."
		/>
	{/if}
</svelte:head>
