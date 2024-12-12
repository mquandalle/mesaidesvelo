<script>
	import 'virtual:windi.css';
	import Footer from './Footer.svelte';
	import Emoji from '$lib/components/Emoji.svelte';
	import { dev } from '$app/environment';
</script>

<svelte:head>
	<title>Trouvez les aides pour le retrofit de votre voiture</title>
	{#if !dev}
		<script defer data-domain="aideretrofit.fr" src="/js/script.js"></script>
	{/if}
</svelte:head>

<div class="px-3 sm:px-8 max-w-screen-md m-auto h-screen flex flex-col">
	<header class="mt-12 flex flex-row justify-between items-end">
		<a href="/" class="text-3xl font-bold cursor-pointer">
			Aide<span class="text-sky-600">Retrofit</span>
			<Emoji emoji="🚗" className="-mt-2 -mr-2" />
			<Emoji emoji="⚡" className="-mt-2 text-2xl" />
			<span class="text-xl text-gray-400">[béta]</span>
		</a>
		<a
			href="https://mesaidesvelo.fr"
			rel="external"
			class="underline underline-sky-400 underline-offset-4 text-sky-700 hover:text-sky-500 <sm:hidden"
			>Aides vélo</a
		>
	</header>
	<main class="flex-1">
		<slot />
	</main>

	<Footer />
</div>

<style>
	/* TODO This is obvisouly extremily hacky */

	:global(.bg-green-50) {
		@apply !bg-sky-50;
	}
	:global(.bg-green-100) {
		@apply !bg-sky-100;
	}
	:global(.bg-green-200) {
		@apply !bg-sky-200;
	}
	:global(.bg-green-300) {
		@apply !bg-sky-300;
	}
	:global(.bg-green-400) {
		@apply !bg-sky-400;
	}
	:global(.bg-green-500) {
		@apply !bg-sky-500;
	}
	:global(.bg-green-600) {
		@apply !bg-sky-600;
	}
	:global(.border-green-600) {
		@apply !border-sky-600;
	}
	:global(.hover\:bg-green-100) {
		@apply !hover:bg-sky-100;
	}
	:global(.hover\:bg-green-200) {
		@apply !hover:bg-sky-200;
	}
	:global(.hover\:bg-green-300) {
		@apply !hover:bg-sky-300;
	}
	:global(.hover\:bg-green-400) {
		@apply !hover:bg-sky-400;
	}
	:global(.hover\:border-green-300) {
		@apply !hover:border-sky-300;
	}
	:global(.text-green-700) {
		@apply !text-sky-700;
	}
	:global(.hover\:text-green-600) {
		@apply !hover:text-sky-600;
	}
	:global(.hover\:text-green-700) {
		@apply !hover:text-sky-700;
	}
	:global(.border-green-300) {
		@apply !border-sky-300;
	}
	:global(.border-green-400) {
		@apply !border-sky-400;
	}
	:global(input[type='radio']) {
		--form-control-color: #0284c7 !important;
	}
</style>
