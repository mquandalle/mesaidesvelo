<script>
	import JagisCta from '$lib/components/JagisCTA.svelte';
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

<div
	class="flex flex-wrap sm:flex-row items-center justify-end gap-3 mt-6 w-full max-w-screen-md m-auto text-gray-500"
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
<section class="w-full max-w-screen-md m-auto mt-12 flex flex-col gap-6">
	<div
		class="flex items-start bg-yellow-50 border border-yellow-100 p-4 mt-2 rounded gap-4"
		role="alert"
	>
		<span class="bg-white border border-yellow-100 px-2 py-1 w-min rounded-lg"> ✨ </span>
		<div>
			<h3 class="font-semibold text-lg">Dernières nouveautés</h3>

			<p class="text-sm text-gray-800 mt-2">
				Ces derniers mois, plusieurs améliorations ont été apportées à <span class="italic"
					>MesAidesVélo</span
				>
				par les équipes de
				<a
					href="https://beta.gouv.fr"
					target="_blank"
					class="text-green-600
					hover:underline">beta.gouv.fr</a
				> qui ont repris le travail sur la mise à jour des aides. Voici les principales nouveautés :
			</p>
			<ul class="mt-4">
				<li class="text-sm text-gray-800 mt-2">
					🚀 <strong>Mise à jour des aides</strong> - la totalité des aides ont été mises à jour et de
					nouvelles aides ont été ajoutées.
				</li>
				<li class="text-sm text-gray-800 mt-2">
					🦽 <strong>Nouveau type de vélo</strong> - les vélos adaptés pour les personnes à mobilité
					réduite sont désormais pris en compte.
				</li>
				<li class="text-sm text-gray-800 mt-2">
					🚲 <strong>Vélo d'occasion</strong> - il est désormais possible de choisir les aides en fonction
					de l'état du vélo (neuf ou occasion).
				</li>
			</ul>
			<p class="text-sm text-green-600 mt-4">
				<a
					href="https://github.com/betagouv/publicodes-aides-velo/releases"
					target="_blank"
					class="hover:underline">→ En savoir plus</a
				>
			</p>
		</div>
	</div>

	<JagisCta />
</section>
