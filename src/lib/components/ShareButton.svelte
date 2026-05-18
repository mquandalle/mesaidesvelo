<script lang="ts">
	import { page } from '$app/state';
	import Emoji from './Emoji.svelte';

	interface Props {
		title?: string;
	}

	let { title = 'Trouvez une aide vélo sur MesAidesVélo' }: Props = $props();

	let shareApiAvailabe = $derived(
		typeof window !== 'undefined' && navigator?.canShare?.({ title, url: page.url.pathname }),
	);
	const share = () => {
		const query = new URLSearchParams();
		query.append('utm_source', 'sharing');
		const url = page.url.pathname + '?' + query.toString();
		navigator.share({ title, url });
	};
</script>

{#if shareApiAvailabe}
	<p class="sm:text-center mt-4">
		<button
			class="border rounded px-6 py-2 text-green-800 font-semibold bg-green-50 hover:bg-green-200 border border-green-200 hover:border-green-300"
			onclick={share}
			>Partager cette page <Emoji emoji="🚀" />
		</button>
	</p>
{/if}
