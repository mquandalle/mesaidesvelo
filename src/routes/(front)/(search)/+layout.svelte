<script>
	import { page } from '$app/stores';
	import PaneNavigation from '$lib/components/PaneNavigation.svelte';
	import Search from '$lib/components/Search.svelte';
</script>

<Search />
{#if $page !== '/'}
	<PaneNavigation
		depth={$page.url.pathname === '/prime-a-la-conversion' ||
		$page.url.pathname === '/forfait-mobilite-durable'
			? 1
			: 0}
	>
		<slot />
	</PaneNavigation>
{/if}
