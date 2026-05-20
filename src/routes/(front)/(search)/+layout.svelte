<script lang="ts">
	import { page } from '$app/state';
	import HomeSearch from '$lib/components/HomeSearch.svelte';
	import PaneNavigation from '$lib/components/PaneNavigation.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

{#if page.url.pathname === '/'}
	<HomeSearch />
	{@render children?.()}
{:else}
	<PaneNavigation
		depth={page.url.pathname === '/prime-a-la-conversion' ||
		page.url.pathname === '/forfait-mobilite-durable'
			? 1
			: 0}
	>
		{@render children?.()}
	</PaneNavigation>
{/if}
