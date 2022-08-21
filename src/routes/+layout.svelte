<script>
	import { prefetchRoutes } from '$app/navigation';
	import { page } from '$app/stores';
	import { localisation } from '$lib/stores';
	import Emoji from '$lib/components/Emoji.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount, setContext } from 'svelte';
	import 'virtual:windi.css';

	onMount(() => {
		prefetchRoutes(['/', '/ville/*']);
	});

	const isEmbeded = Boolean($page.url.searchParams.get('iframe'));
	const embedSource = isEmbeded && $page.url.searchParams.get('utm_source');
	setContext('embed', { isEmbeded, embedSource });

	let pageElement;

	onMount(() => {
		if (!isEmbeded) {
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
	let enableTracking = import.meta.env.PROD && !isEmbeded;

	// The city can be provided from the URL, for instance /ville/paris. The
	// `data` output of a load function provides a mechanism for pages to pass
	// data 'upward' to layouts, which is useful in our case since the selected
	// city is a "global state".
	localisation.set($page.data?.ville ?? null);
	$: if ($page.data?.ville) {
		localisation.set($page.data.ville);
	}
</script>

<svelte:window on:click={() => (enableTracking = true)} />

<div class="px-3 sm:px-8 {!isEmbeded ? 'h-screen' : ''} flex flex-col" bind:this={pageElement}>
	<header class="{!isEmbeded ? 'mt-8' : ''} block w-full max-w-screen-md m-auto">
		{#if !isEmbeded}
			<a href="/" class="text-3xl font-bold cursor-pointer">
				Mes<span class="text-green-800">Aides</span>Vélo<span class="text-xl text-gray-600"
					>.fr</span
				>
				<Emoji emoji="🚲" className="-mt-2" />
			</a>
		{/if}
	</header>
	<div class="pb-6 {!isEmbeded ? 'flex-1' : ''}">
		<slot />
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
