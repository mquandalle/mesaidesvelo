<script lang="ts">
	import { building, dev } from '$app/environment';
	import { afterNavigate, onNavigate, preloadCode } from '$app/navigation';
	import { page } from '$app/state';
	import Emoji from '$lib/components/Emoji.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Search from '$lib/components/Search.svelte';
	import { setSimulation } from '$lib/simulation/context.svelte';
	import { SimulationState } from '$lib/simulation/state.svelte';
	import { onMount, setContext } from 'svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	const simulation = setSimulation(new SimulationState());

	onNavigate((navigation) => {
		if (typeof document === 'undefined') {
			return;
		}

		const isSearchTransition =
			(page.url.pathname === '/' && navigation.to?.url.pathname.startsWith('/ville/')) ||
			(page.url.pathname.startsWith('/ville/') && navigation.to?.url.pathname === '/');
		const nextUrl = navigation.to?.url;
		const isSameCityBikeTransition =
			nextUrl?.pathname === page.url.pathname &&
			page.url.pathname.startsWith('/ville/') &&
			page.url.searchParams.get('velo') !== nextUrl.searchParams.get('velo');
		const isForfaitMobilitesTransition =
			(page.url.pathname.startsWith('/ville/') &&
				nextUrl?.pathname === '/forfait-mobilite-durable') ||
			(page.url.pathname === '/forfait-mobilite-durable' &&
				Boolean(nextUrl?.pathname.startsWith('/ville/')));
		const isBikeDetailTransition = isSameCityBikeTransition || isForfaitMobilitesTransition;

		if (!isSearchTransition && !isBikeDetailTransition) {
			return;
		}

		const documentWithTransition = document as Document & {
			startViewTransition?: (callback: () => Promise<void> | void) => {
				finished: Promise<void>;
			};
		};

		if (!documentWithTransition.startViewTransition) {
			if (isSearchTransition) {
				document.documentElement.classList.add('mav-route-morph');
			}
			if (isBikeDetailTransition) {
				document.documentElement.classList.add('mav-bike-route-morph');
			}
			return () => {
				window.setTimeout(() => {
					document.documentElement.classList.remove('mav-route-morph');
					document.documentElement.classList.remove('mav-bike-route-morph');
				}, 320);
			};
		}

		return new Promise<void>((resolve) => {
			if (isBikeDetailTransition) {
				document.documentElement.classList.add('mav-native-bike-route-morph');
			}

			const transition = documentWithTransition.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			transition.finished
				.catch(() => {})
				.finally(() => {
					document.documentElement.classList.remove('mav-native-bike-route-morph');
				});
		});
	});

	afterNavigate(() => {
		simulation.rememberLocalisation(page.data?.ville);
	});

	onMount(() => {
		preloadCode('/');
		preloadCode('/ville/*');

		// This is a work-around a cold-start issue with the search
		// autocompletion. By calling this endpoint as soon as possible we
		// asynchrounsly warm up the server code, and reduce the latency in case
		// of a cold start.
		if (!dev) {
			fetch('/api/collectivites');
		}
	});

	const isEmbeded = Boolean(building ? false : page.url.searchParams.get('iframe'));
	const embedSource = isEmbeded && page.url.searchParams.get('utm_source');
	setContext('embed', { isEmbeded, embedSource });

	let pageElement = $state<HTMLElement>();

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

		if (pageElement) {
			observer.observe(pageElement);
		}
	});

	// When the site is embeded in an iframe, we don't want to track a “visit”
	// every time the page is loaded, as the iframe is oftentimes low on the
	// page and the user might not interact with it or even see it. We disable
	// tracking up until the first click interaction;
	let enableTracking = $state(import.meta.env.PROD && !isEmbeded);

	function resetSearchOnHomeNavigation() {
		simulation.clearRememberedLocalisation();
	}
</script>

<svelte:window onclick={() => (enableTracking = true)} />

{#if isEmbeded}
	<div class="embeded-too-small text-xl text-center items-center justify-center h-[100vh]">
		<p>
			Retrouvez toutes les aides à l’achat d’un vélo sur le site<br />
			<a
				href="https://mesaidesvelo.fr"
				target="_blank"
				class="inline-block mt-2 font-bold underline hover:text-green-800"
				>Mes<span class="text-green-600">aides</span>velo.fr</a
			>
		</p>
	</div>
{/if}

<div
	class="app flex flex-col px-4 sm:px-6 {!isEmbeded ? 'min-h-screen' : ''}"
	bind:this={pageElement}
>
	{#if page.url.pathname !== '/' || isEmbeded}
		<header
			class={[
				!isEmbeded ? 'pt-5 pb-2' : 'pt-3',
				'relative z-50 mx-auto grid w-full max-w-screen-md items-center gap-3 md:grid-cols-[auto_minmax(0,1fr)]',
			]}
		>
			{#if !isEmbeded}
				<a
					href="/"
					class="flex min-w-0 items-center gap-2.5 no-underline transition-opacity hover:opacity-85"
					onclick={resetSearchOnHomeNavigation}
					aria-label="MesAidesVélo"
				>
					<img src="/images/logo.svg" alt="" class="mav-logo-transition h-11 w-auto shrink-0" />
					<span class="text-xl font-extrabold text-[#172338]"
						>Mes<span class="text-[#16a34a]">Aides</span>Vélo</span
					>
				</a>
				{#if page.url.pathname.startsWith('/ville/')}
					<div class="w-full md:w-[360px] md:justify-self-end">
						<Search variant="header" />
					</div>
				{/if}
			{:else}
				<a href="/" class="text-2xl font-bold cursor-pointer">
					Mes<span class="text-[#16a34a]">Aides</span>Vélo.fr
				</a>
			{/if}
		</header>
	{/if}
	<div class="pb-12 {!isEmbeded ? 'flex-1' : ''}">
		{@render children?.()}
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
