<script lang="ts">
	import { page } from '$app/state';
	import PaneNavigation from '$lib/components/PaneNavigation.svelte';
	import Search from '$lib/components/Search.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<Search />

{@render children?.()}

{#if page.url.pathname !== '/'}
	<PaneNavigation
		depth={page.url.pathname === '/prime-a-la-conversion' ||
		page.url.pathname === '/forfait-mobilite-durable'
			? 1
			: 0}
	>
		{@render children?.()}
	</PaneNavigation>
{/if}
