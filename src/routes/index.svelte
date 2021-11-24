<script>
	import Search from '$lib/components/Search.svelte';
	import { localisation } from '$lib/stores';

	localisation.set(null);
</script>

<svelte:head>
	<title>MesAidesVélo - Toutes les aides !</title>
	<meta
		name="description"
		content="Découvrez l’ensemble des aides à l’achat ou la localisation de vélo proposées par votre ville, département, région et par l’État. Simple, rapide et gratuit."
	/>
</svelte:head>

<Search />
