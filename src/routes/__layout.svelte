<script>
	import { page } from '$app/stores';
	import App from '$lib/components/App.svelte';
	import Emoji from '$lib/components/Emoji.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { localisation } from '$lib/stores/localisation';
	import 'virtual:windi.css';
</script>

<div class="px-4 sm:px-8 max-w-screen-md m-auto h-screen flex flex-col">
	<header class="mt-8">
		<a href="/" class="text-3xl font-bold cursor-pointer" on:click={() => localisation.set(null)}>
			Mes<span class="text-green-800">Aides</span>Vélo
			<sup class="text-sm text-gray-400">[béta]</sup>
			<Emoji emoji="🚲" className="-mt-2" />
		</a>
		<p class="text-gray-800 mt-1 max-w-sm">Trouvez les aides à l’achat d’un vélo</p>
	</header>
	<div class="flex-1 pb-6">
		<!-- We include the <App /> component in the general layout for fluid page transitions -->
		{#if $page.path === '' || $page.path === '/' || $page.path.startsWith('/ville')}
			<App />
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
