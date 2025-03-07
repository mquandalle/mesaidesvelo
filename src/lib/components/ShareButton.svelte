<script>
	import { page } from '$app/stores';
	import Emoji from './Emoji.svelte';

	export let title = 'Trouvez une aide vélo sur MesAidesVélo';

	const shareApiAvailabe =
		typeof window !== 'undefined' && navigator?.canShare?.({ title, url: $page.url.pathname });
	const share = () => {
		const query = new URLSearchParams();
		query.append('utm_source', 'sharing');
		const url = $page.url.pathname + '?' + query.toString();
		navigator.share({ title, url });
	};
</script>

{#if shareApiAvailabe}
	<p class="sm:text-center mt-4">
		<button
			class="border rounded px-6 py-2 text-green-800 font-semibold bg-green-50 hover:bg-green-200 border border-green-200 hover:border-green-300"
			on:click={share}
			>Partager cette page <Emoji emoji="🚀" />
		</button>
	</p>
{/if}
