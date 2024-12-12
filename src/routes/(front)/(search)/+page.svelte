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

<div
	class="flex flex-wrap sm:flex-row items-center justify-end gap-3 mt-6 w-full max-w-screen-md m-auto text-gray-500"
>
	Essayez avec

	{#each biggestCities as city}
		<a
			href="/ville/{city.toLowerCase()}"
			class="inline-block text-center border border-current rounded-full text-green-500 px-4 py-2 sm:px-3 sm:py-1 hover:(bg-green-500 text-white)"
			>{city}</a
		>
	{/each}
</div>
<section class="w-full max-w-screen-md m-auto mt-12">
	<!-- callout with a summary of the latest features -->
	<div class="bg-yellow-50 border border-yellow-100 p-4 mt-2 rounded" role="alert">
		<h2 class="font-bold text-lg mb-4">🚀 Nouveautés !</h2>
		<ul>
			<!-- 1. prise en compte des vélos adapté pour les personnes en situation de handicap -->
			<li class="mb-2">
				<span class="font-bold">🦿 Vélos adaptés</span> : les aides pour les vélos adaptés sont désormais
				intégrées.
			</li>
			<!-- 2. suppression du bonus écologique et de la prime à la conversion -->
			<li class="mb-2">
				<span class="font-bold">🏛️ Aides de nationales</span> :
				<a href="/prime-a-la-conversion" target="_blank"
					>suppression du Bonus écologique et de la Prime à la conversion.</a
				>
			</li>
			<!-- 3. relecture et mises à jour de la totalité des aides -->
			<li class="mb-2">
				<span class="font-bold">🔍 Mises à jour</span>
				: relecture et mises à jour de l'ensemble des aides pour 2024.
			</li>
		</ul>
	</div>
</section>

<!-- CTA to the website jagis.beta.gouv.fr with a baseline -->
<section class="w-full max-w-screen-md m-auto mt-12">
	<div class="bg-green-50 border border-green-100 p-4 mt-2 rounded" role="alert">
		<a
			href="https://jagis.beta.gouv.fr"
			class="inline-block bg-green-500 text-white font-bold rounded-full py-2 px-4 hover:bg-green-600"
			>Tester Jagis</a
		>
		<p class="text-sm text-gray-600 mt-2">
			Le site Jagis vous permet de connaître les aides auxquelles vous avez droit en quelques clics.
		</p>
	</div>
</section>
