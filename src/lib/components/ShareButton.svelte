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
	<p class="mt-5 sm:text-center">
		<button
			class="rounded-full border border-[#cfe2da] bg-white px-5 py-2 text-sm font-bold text-[#16a34a] shadow-sm hover:border-[#16a34a] hover:bg-[#f0fdf4]"
			onclick={share}
			>Partager cette page <Emoji emoji="🚀" />
		</button>
	</p>
{/if}
