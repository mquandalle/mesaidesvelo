<script>
	import { preloadCode } from '$app/navigation';
	import { page } from '$app/stores';
	import { localisation } from '$lib/stores';
	import Emoji from '$lib/components/Emoji.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount, setContext } from 'svelte';
	import 'virtual:windi.css';
	import { building, dev } from '$app/environment';

	onMount(() => {
		preloadCode('/', '/ville/*');

		// This is a work-around a cold-start issue with the search
		// autocompletion. By calling this endpoint as soon as possible we
		// asynchrounsly warm up the server code, and reduce the latency in case
		// of a cold start.
		if (!dev) {
			fetch('/api/collectivites');
		}
	});

	const isEmbeded = Boolean(building ? false : $page.url.searchParams.get('iframe'));
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

{#if isEmbeded}
	<div class="embeded-too-small text-xl text-center items-center justify-center h-[100vh]">
		<p>
			Retrouvez toutes les aides à l’achat d’un vélo sur le site<br />
			<a
				href="https://mesaidesvelo.fr"
				target="_blank"
				class="inline-block mt-2 font-bold underline hover:text-green-800"
				>Mes<span class="text-green-800">aides</span>velo.fr</a
			>
		</p>
	</div>
{/if}

<div class="app px-3 sm:px-8 {!isEmbeded ? 'h-screen' : ''} flex flex-col" bind:this={pageElement}>
	<header
		class="{!isEmbeded
			? 'mt-8'
			: ''} w-full max-w-screen-md m-auto flex flex-row justify-between items-end"
	>
		{#if !isEmbeded}
			<a href="/" class="text-3xl font-bold cursor-pointer">
				Mes<span class="text-green-800">Aides</span>Vélo
				<Emoji emoji="🚲" className="-mt-2" />
			</a>
			<a
				href="https://aideretrofit.fr"
				rel="external"
				class="underline underline-green-400 underline-offset-4 text-green-600 hover:text-green-400 <sm:hidden"
				>Aide Retrofit</a
			>
		{/if}
	</header>
	<div class="pb-6 {!isEmbeded ? 'flex-1' : ''}">
		<slot />
	</div>
	<Footer />

	{#if !dev && enableTracking}
		<script defer data-domain="mesaidesvelo.fr" src="/js/script.js"></script>
	{/if}
</div>

<style>
	:global(body) {
		min-height: 100vh;
	}

	.embeded-too-small {
		display: none;
	}

	@media (max-height: 300px) {
		.embeded-too-small + .app {
			display: none;
		}

		.embeded-too-small {
			display: flex;
		}
	}
</style>
