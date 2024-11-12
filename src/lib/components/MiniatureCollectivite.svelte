<script>
	import miniatures from '$lib/data/miniatures';

	export let ruleName;
	export let titre;
</script>

{#if miniatures[ruleName]}
	<img
		src="/miniatures/{miniatures[ruleName]}"
		alt="Logo de {titre}"
		class="float-left pt-4 mr-6 !mb-6 max-h-[120px] w-[140px] object-contain"
	/>
{/if}
