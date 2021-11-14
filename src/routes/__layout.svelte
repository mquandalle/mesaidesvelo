<script>
	import Emoji from '$lib/components/Emoji.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { localisation } from '$lib/stores/localisation';
	import 'virtual:windi.css';
</script>

<!-- TODO : Le paquet publicodes ne peut pas être importé normallement avec un
`import Engine from "publicodes"`, vraisembablement car le paquet n'est pas sous
le bon format ES Module. Hack : passer par unpkg directement dans le navigateur.
-->
<window:head>
	<script src="https://unpkg.com/publicodes@next/dist/index.min.js"></script>
</window:head>

<div class="px-4 sm:px-8 max-w-screen-md m-auto h-screen flex flex-col">
	<a
		href="/"
		class="text-3xl mt-8 font-bold mb-1 cursor-pointer"
		on:click={() => localisation.set(null)}
	>
		Mes<span class="text-green-800">Aides</span>Vélo <sup class="text-sm text-gray-400">[béta]</sup>
		<Emoji emoji="🚲" className="-mt-2" />
	</a>
	<p class="text-gray-800 text max-w-sm">Trouvez les aides à l’achat d’un vélo</p>
	<div class="flex-1 pb-6"><slot /></div>
	<Footer />
</div>

<style>
	:global(body) {
		min-height: 100vh;
	}
</style>
