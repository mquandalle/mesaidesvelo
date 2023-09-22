<script>
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import UserFeedback from './UserFeedback.svelte';

	const { isEmbeded } = getContext('embed');
</script>

<footer
	class="flex flex-col items-start gap-6 py-6 pt-3 justify-between w-full max-w-screen-md mx-auto md:(flex-row items-end) text-xs"
>
	{#if !isEmbeded || $page.url.pathname !== '/'}<UserFeedback />{/if}
	{#if !isEmbeded}
		<ul class="flex flex-wrap gap-x-4 gap-y-3 text-gray-600 md:justify-end">
			<li>
				<a href="/a-propos" class="hover:(underline text-s4-green)">À propos</a>
			</li>
			<li>
				<a href="https://aideretrofit.fr" rel="external" class="  hover:(underline text-s4-green)"
					>Aide Retrofit</a
				>
			</li>
			<li>
				<a href="/liste-aides" class="hover:(underline text-s4-green)">Liste des aides</a>
			</li>
			<li>
				<a
					href="https://github.com/mquandalle/mesaidesvelo"
					target="_blank"
					class="inline-flex gap-x-2 hover:(underline text-s4-green)"
				>
					Code Source
					<svg viewBox="15 15 34 34" class="h-4"
						><path
							d="M32,16c-8.8,0-16,7.2-16,16c0,7.1,4.6,13.1,10.9,15.2 c0.8,0.1,1.1-0.3,1.1-0.8c0-0.4,0-1.4,0-2.7c-4.5,1-5.4-2.1-5.4-2.1c-0.7-1.8-1.8-2.3-1.8-2.3c-1.5-1,0.1-1,0.1-1 c1.6,0.1,2.5,1.6,2.5,1.6c1.4,2.4,3.7,1.7,4.7,1.3c0.1-1,0.6-1.7,1-2.1c-3.6-0.4-7.3-1.8-7.3-7.9c0-1.7,0.6-3.2,1.6-4.3 c-0.2-0.4-0.7-2,0.2-4.2c0,0,1.3-0.4,4.4,1.6c1.3-0.4,2.6-0.5,4-0.5c1.4,0,2.7,0.2,4,0.5c3.1-2.1,4.4-1.6,4.4-1.6 c0.9,2.2,0.3,3.8,0.2,4.2c1,1.1,1.6,2.5,1.6,4.3c0,6.1-3.7,7.5-7.3,7.9c0.6,0.5,1.1,1.5,1.1,3c0,2.1,0,3.9,0,4.4 c0,0.4,0.3,0.9,1.1,0.8C43.4,45.1,48,39.1,48,32C48,23.2,40.8,16,32,16z"
							class="fill-current"
						/></svg
					>
				</a>
			</li>
		</ul>
	{/if}
</footer>
