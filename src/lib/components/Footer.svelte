<script>
	import { page } from '$app/state';
	import { getContext } from 'svelte';
	import UserFeedback from './UserFeedback.svelte';

	const { isEmbeded } = getContext('embed');
</script>

<footer class="mx-auto flex w-full max-w-screen-md border-t border-[#dfe6ef] py-6 text-xs">
	<div
		class="flex w-full flex-col gap-5 text-[0.8rem] sm:flex-row sm:items-center sm:justify-between"
	>
		{#if !isEmbeded}
			<ul class="flex flex-wrap gap-x-6 gap-y-3 text-[#647085]">
				<li>
					<a href="/a-propos" class="font-semibold text-[#16a34a] hover:underline">À propos</a>
				</li>
				<li>
					<a href="/liste-aides" class="font-semibold text-[#16a34a] hover:underline"
						>Liste des aides</a
					>
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
		{#if !isEmbeded || page.url.pathname !== '/'}
			<div class="h-fit sm:ml-auto">
				<UserFeedback />
			</div>
		{/if}
	</div>
</footer>
