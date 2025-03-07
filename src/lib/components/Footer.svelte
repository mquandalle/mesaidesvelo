<script>
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import UserFeedback from './UserFeedback.svelte';

	const { isEmbeded } = getContext('embed');
</script>

<footer
	class="flex flex-col items-start gap-6 py-6 pt-3 justify-between w-full max-w-screen-md mx-auto md:(flex-row) text-xs border-t border-gray-200"
>
	{#if !isEmbeded || $page.url.pathname !== '/'}<UserFeedback />{/if}
	{#if !isEmbeded}
		<ul class="flex flex-wrap gap-x-4 gap-y-3 text-gray-600 md:justify-end">
			<li>
				<a href="/a-propos" class="text-green-600 hover:underline">À propos</a>
			</li>
			<li>
				<a href="https://aideretrofit.fr" rel="external" class="text-green-600 hover:underline"
					>Aide Retrofit</a
				>
			</li>
			<li>
				<a href="/liste-aides" class="text-green-600 hover:underline">Liste des aides</a>
			</li>
			<li>
				Code Source :
				<a
					href="https://github.com/mquandalle/mesaidesvelo"
					target="_blank"
					class="inline-flex gap-x-2 text-green-600 hover:underline"
				>
					Site
				</a>
				/
				<a
					href="https://github.com/betagouv/publicodes-aides-velo/blob/main/src/rules/aides.publicodes"
					target="_blank"
					class="inline-flex gap-x-2 text-green-600 hover:underline"
				>
					Aides
				</a>
			</li>
		</ul>
	{/if}
</footer>
