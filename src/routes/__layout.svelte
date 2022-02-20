<script>
	import { prefetchRoutes } from '$app/navigation';
	import { page } from '$app/stores';
	import { localisation } from '$lib/stores';
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

	const embeded = Boolean($page.url.searchParams.get('iframe'));
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

	// When the site is embeded in an iframe, we don't want to track a “visit”
	// every time the page is loaded, as the iframe is oftentimes low on the
	// page and the user might not interact with it or even see it. We disable
	// tracking up until the first click interaction;
	let enableTracking = import.meta.env.PROD && !embeded;

	// The city can be provided from the URL, for instance /ville/paris. The
	// `stuff` output of a load function provides a mechanism for pages to pass
	// data 'upward' to layouts, which is useful in our case since the selected
	// city is a "global state".
	// https://kit.svelte.dev/docs#loading-output-stuff
	localisation.set($page.stuff?.ville ?? null);
	$: if ($page.stuff?.ville) {
		localisation.set($page.stuff.ville);
	}
</script>

<svelte:window on:click={() => (enableTracking = true)} />

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
		{#if $page.url.pathname === '/' || $page.url.pathname.startsWith('/ville') || $page.url.pathname === '/prime-a-la-conversion'}
			<Search />
			{#if $page !== '/'}
				<PaneNavigation depth={$page.url.pathname === '/prime-a-la-conversion' ? 1 : 0}>
					<slot />
				</PaneNavigation>
			{/if}
		{:else}
			<slot />
		{/if}
	</div>
	<Footer />

	{#if enableTracking}
		<script defer data-domain="mesaidesvelo.fr" src="/js/script.js"></script>
	{/if}
</div>

<style>
	:global(body) {
		min-height: 100vh;
	}
</style>
