<script>
	import { page } from '$app/stores';
	import Details from '$lib/components/Details.svelte';
	import Results from '$lib/components/Results.svelte';
	import Search from '$lib/components/Search.svelte';
	import { localisation } from '$lib/stores/localisation';
	import { fly } from 'svelte/transition';
</script>

<Search />

{#if $localisation}
	<div class="grid overflow-hidden -m-4 p-4" transition:fly|local={{ y: 30 }}>
		{#if $page.query.get('velo')}
			<div
				class="col-start-1 col-end-1 row-start-1 row-end-1"
				transition:fly|local={{ x: 600, duration: 400 }}
			>
				<Details />
			</div>
		{:else}
			<div
				class="col-start-1 col-end-1 row-start-1 row-end-1"
				transition:fly|local={{ x: -600, duration: 400 }}
			>
				<Results />
			</div>
		{/if}
	</div>
{/if}
