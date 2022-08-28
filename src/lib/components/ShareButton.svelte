<script>
	import { page } from '$app/stores';

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
			class="text-lg border rounded px-6 py-2 text-green-800 font-semibold bg-green-50 hover:bg-green-200 border-green-200 border-3"
			on:click={share}
			>Partager cette page
		</button>
	</p>
{/if}
