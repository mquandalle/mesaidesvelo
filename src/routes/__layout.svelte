<script>
	import { prefetchRoutes } from '$app/navigation';
	import { page } from '$app/stores';
	import Emoji from '$lib/components/Emoji.svelte';
	import Footer from '$lib/components/Footer.svelte';
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
	const inIframe = typeof window !== 'undefined' && window.self !== window.top;

	let prevHeight = 0;
	function postMessageHeight() {
		const height = pageElement?.clientHeight;
		if (height && inIframe && prevHeight !== height) {
			window.parent.postMessage({ kind: 'resize-height', value: height });
			prevHeight = height;
			window.setTimeout(postMessageHeight, 700);
		}
	}
</script>

<svelte:window on:sveltekit:navigation-end={postMessageHeight} />

<div class="px-4 sm:px-8 {!embeded ? 'h-screen' : ''} flex flex-col" bind:this={pageElement}>
	{#if !embeded}
		<header class="mt-8 block w-full max-w-screen-md m-auto">
			<a href="/" class="text-3xl font-bold cursor-pointer">
				Mes<span class="text-green-800">Aides</span>Vélo
				<sup class="text-sm text-gray-400">[béta]</sup>
				<Emoji emoji="🚲" className="-mt-2" />
			</a>
			<p class="text-gray-800 mt-1 max-w-sm">Trouvez les aides à l’achat d’un vélo</p>
		</header>
	{/if}
	<div class="pb-6 {!embeded ? 'flex-1' : ''}">
		{#if $page.path === '/' || $page.path.startsWith('/ville') || $page.path === '/prime-a-la-conversion'}
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
