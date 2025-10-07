<script>
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import UserFeedback from './UserFeedback.svelte';

	const { isEmbeded } = getContext('embed');
</script>

<footer
	class="flex flex-col items-start gap-3 py-6 justify-between w-full max-w-screen-md mx-auto text-xs border-t border-gray-200"
>
	<div class="flex flex-col sm:flex-row gap-6 sm:items-center text-[0.8rem] mb-2">
		{#if !isEmbeded || $page.url.pathname !== '/'}
			<div class="h-fit">
				<UserFeedback />
			</div>
		{/if}
		{#if !isEmbeded}
			<ul class="flex flex-wrap gap-x-4 gap-y-3 text-gray-600 md:justify-end">
				<li>
					<a href="/a-propos" class="text-green-600 hover:underline">À propos</a>
				</li>
				<!-- NOTE(@EmileRolley): je désactive ce lien car, aideretrofit.fr n'est plus maintenu -->
				<!-- <li> -->
				<!-- 	<a href="https://aideretrofit.fr" rel="external" class="text-green-600 hover:underline" -->
				<!-- 		>Aide Retrofit</a -->
				<!-- 	> -->
				<!-- </li> -->
				<li>
					<a href="/liste-aides" class="text-green-600 hover:underline">Liste des aides</a>
				</li>
				<!-- <li> -->
				<!-- 	Code Source : -->
				<!-- 	<a -->
				<!-- 		href="https://github.com/mquandalle/mesaidesvelo" -->
				<!-- 		target="_blank" -->
				<!-- 		class="inline-flex gap-x-2 text-green-600 hover:underline" -->
				<!-- 	> -->
				<!-- 		Site -->
				<!-- 	</a> -->
				<!-- 	/ -->
				<!-- 	<a -->
				<!-- 		href="https://github.com/betagouv/publicodes-aides-velo/blob/main/src/rules/aides.publicodes" -->
				<!-- 		target="_blank" -->
				<!-- 		class="inline-flex gap-x-2 text-green-600 hover:underline" -->
				<!-- 	> -->
				<!-- 		Aides -->
				<!-- 	</a> -->
				<!-- </li> -->
			</ul>
		{/if}
	</div>

	{#if !isEmbeded}
		<p class="text-gray-600">
			Un simulateur d’aides à l’achat d’un vélo, libre et gratuit. Projet initié par Maxime
			Quandalle et à présent maintenu par <a
				href="https://calinou.coop"
				class="text-green-600 hover:underline"
				target="_blank"
			>
				Calinou</a
			>.
		</p>
		<p class="text-gray-600">
			Parcourir <a
				href="https://github.com/betagouv/publicodes-aides-velo"
				target="_blank"
				class="text-green-600 hover:underline">la modélisation des aides</a
			>
			et
			<a
				href="https://github.com/mquandalle/mesaidesvelo"
				target="_blank"
				class="text-green-600 hover:underline">le code source du site</a
			>.
		</p>{/if}
</footer>
