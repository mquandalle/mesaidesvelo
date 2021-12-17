<script>
	import { prefetchRoutes } from '$app/navigation';
	import Emoji from '$lib/components/Emoji.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import 'virtual:windi.css';

	onMount(() => {
		prefetchRoutes(['/', '/ville/*']);
		// This is a work-around a cold-start issue with the search
		// autocompletion. By calling this endpoint as soon as possible we
		// asynchrounsly warm up the server code, and reduce the latency in case
		// of a cold start. https://github.com/mquandalle/mesaidesvelo/issues/84
		fetch('/api/collectivites');
	});
</script>

<div class="px-4 sm:px-8 h-screen flex flex-col">
	<header class="mt-8 block w-full max-w-screen-md m-auto">
		<a href="/" class="text-3xl font-bold cursor-pointer">
			Mes<span class="text-green-800">Aides</span>Vélo
			<sup class="text-sm text-gray-400">[béta]</sup>
			<Emoji emoji="🚲" className="-mt-2" />
		</a>
		<p class="text-gray-800 mt-1 max-w-sm">Trouvez les aides à l’achat d’un vélo</p>
	</header>
	<div class="flex-1 pb-6">
		<slot />
	</div>
	<Footer />
</div>

<style>
	:global(body) {
		min-height: 100vh;
	}
</style>
