<script lang="ts">
	import Autumn2025 from '$lib/components/releases/Autumn2025.svelte';
	import Spring2025 from '$lib/components/releases/Spring2025.svelte';
	import { localisation } from '$lib/stores';

	localisation.set(null);

	const biggestCities = ['Paris', 'Lyon', 'Toulouse', 'Nantes', 'Montpellier', 'Strasbourg'];
</script>

<svelte:head>
	<title>MesAidesVélo - Toutes les aides !</title>
	<meta
		name="description"
		content="Découvrez l’ensemble des aides à l’achat ou la localisation de vélo proposées par votre ville, département, région et par l’État. Simple, rapide et gratuit."
	/>
</svelte:head>

<div
	class="flex flex-wrap sm:flex-row items-center justify-start gap-3 mt-6 w-full max-w-screen-md m-auto text-gray-500"
>
	Essayez avec

	{#each biggestCities as city}
		<a
			href="/ville/{city.toLowerCase()}"
			class="inline-block text-center border border-current rounded-full text-green-600 px-4 py-2 sm:px-3 sm:py-1 hover:(bg-green-600 text-white)"
			>{city}</a
		>
	{/each}
</div>

<!-- Latest release info -->

<section class="w-full max-w-screen-md m-auto mt-12 flex flex-col gap-6">
	<div
		class="flex items-start bg-yellow-50 border border-yellow-100 p-4 mt-2 rounded gap-4"
		role="alert"
	>
		<span class="bg-white border border-yellow-100 px-2 py-1 w-min rounded-lg"> ✨ </span>
		<div class="text-sm text-gray-800">
			<h3 class="font-semibold text-lg">Dernières nouveautés</h3>
			<Autumn2025 />
		</div>
	</div>
</section>

<!-- List of previous releases -->

<details class="w-full max-w-screen-md m-auto mt-12 flex flex-col gap-6">
	<summary class="text-lg font-bold cursor-pointer"> Historique des mises à jour </summary>

	<div class="flex flex-col gap-6">
		<div class="flex items-start bg-gray-50 border border-gray-100 p-4 rounded gap-4">
			<span class="bg-white border border-gray-100 px-2 py-1 w-min rounded-lg"> 🗓️ </span>
			<div>
				<h3 class="font-semibold text-lg">Printemps 2025</h3>
				<Spring2025 />
			</div>
		</div>
	</div>
</details>
