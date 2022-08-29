<script>
	import miniaturesManifest from '$lib/data/miniatures.json';

	export let ruleName;
	export let titre;
</script>

{#if miniaturesManifest[ruleName]}
	<img
		src="/miniatures/{miniaturesManifest[ruleName]}"
		alt="Logo de {titre}"
		class="float-left pt-4 mr-6 !mb-6 max-h-[120px] w-[140px] object-contain"
	/>
{/if}
