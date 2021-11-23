<script>
	import { prefetchRoutes } from '$app/navigation';
	import { page } from '$app/stores';
	import Emoji from '$lib/components/Emoji.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Search from '$lib/components/Search.svelte';
	import { onMount } from 'svelte';
	import 'virtual:windi.css';

	onMount(() => {
		prefetchRoutes(['/ville/*']);
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
		<!-- We include the <Search /> component in the general layout for fluid page transitions -->
		{#if $page.path === '' || $page.path === '/' || $page.path.startsWith('/ville')}
			<Search />
		{/if}
		<slot />
	</div>
	<Footer />
</div>

<style>
	:global(body) {
		min-height: 100vh;
	}
</style>
