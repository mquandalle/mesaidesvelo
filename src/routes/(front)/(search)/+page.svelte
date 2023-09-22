<script>
	import { localisation } from '$lib/stores';

	localisation.set(null);

	const biggestCities = ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes'];
</script>

<svelte:head>
	<title>MesAidesVélo - Toutes les aides !</title>
	<meta
		name="description"
		content="Découvrez l’ensemble des aides à l’achat ou la localisation de vélo proposées par votre ville, département, région et par l’État. Simple, rapide et gratuit."
	/>
</svelte:head>

<p class="mt-6 w-full max-w-screen-md m-auto text-gray-500 text-right">
	Essayez avec

	{#each biggestCities as city}
		<a
			href="/ville/{city.toLowerCase()}"
			class="inline-block mb-2 border border-current rounded-xl text-white bg-s4-green px-3 py-1 mx-1 hover:(bg-white text-s4-green)"
			>{city}</a
		>
	{/each}
</p>
