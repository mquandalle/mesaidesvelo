<script>
	import { page } from '$app/stores';

	export let title = 'Trouvez une aide vélo sur MesAidesVélo';

	const shareApiAvailabe =
		typeof window !== 'undefined' && navigator?.canShare?.({ title, url: $page.path });
	const share = () => {
		const query = new URLSearchParams($page.query.toString());
		query.append('utm_source', 'sharing');
		const url = $page.path + '?' + query.toString();
		navigator.share({ title, url });
	};
</script>

{#if shareApiAvailabe}
	<p class="sm:text-right mt-4">
		<button class="text-sm border rounded px-4 py-2 hover:bg-gray-100" on:click={share}
			>→ Partager cette page</button
		>
	</p>
{/if}
