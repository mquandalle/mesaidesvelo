<script>
	import { prefetchRoutes } from '$app/navigation';
	import { page } from '$app/stores';
	import Emoji from '$lib/components/Emoji.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import PaneNavigation from '$lib/components/PaneNavigation.svelte';
	import Search from '$lib/components/Search.svelte';
	import { onMount, setContext } from 'svelte';
	import 'virtual:windi.css';

	onMount(() => {
		prefetchRoutes(['/', '/ville/*']);
		// This is a work-around a cold-start issue with the search
		// autocompletion. By calling this endpoint as soon as possible we
		// asynchrounsly warm up the server code, and reduce the latency in case
		// of a cold start. https://github.com/mquandalle/mesaidesvelo/issues/84
		fetch('/api/collectivites');
	});

	const embeded = Boolean($page.query.get('iframe'));
	setContext('embeded', embeded);

	let pageElement;

	onMount(() => {
		if (!embeded) {
			return;
		}
		// The code below communicate with the iframe.js script on a host site
		// to automatically resize the iframe when its inner content height
		// change.
		const minHeight = 500; // Also used in iframe.js
		const observer = new ResizeObserver(([entry]) => {
			const value = Math.max(minHeight, entry.contentRect.height);
			window.parent?.postMessage({ kind: 'resize-height', value }, '*');
		});

		observer.observe(pageElement);
	});
</script>

<div class="px-4 sm:px-8 {!embeded ? 'h-screen' : ''} flex flex-col" bind:this={pageElement}>
	<header class="{!embeded ? 'mt-8' : ''} block w-full max-w-screen-md m-auto">
		{#if !embeded}
			<a href="/" class="text-3xl font-bold cursor-pointer">
				Mes<span class="text-green-800">Aides</span>Vélo
				<Emoji emoji="🚲" className="-mt-2" />
			</a>
		{/if}
		<p class="text-gray-800 mt-1 max-w-sm">Trouvez les aides à l’achat d’un vélo</p>
	</header>
	<div class="pb-6 {!embeded ? 'flex-1' : ''}">
		{#if $page.path === '/' || $page.path.startsWith('/ville') || $page.path === '/prime-a-la-conversion'}
			<Search />
			{#if $page !== '/'}
				<PaneNavigation depth={$page.path === '/prime-a-la-conversion' ? 1 : 0}>
					<slot />
				</PaneNavigation>
			{/if}
		{:else}
			<slot />
		{/if}
	</div>
	<Footer />
</div>

<style>
	:global(body) {
		min-height: 100vh;
	}
</style>
