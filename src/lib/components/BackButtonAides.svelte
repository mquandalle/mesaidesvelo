<script>
	import { getSimulation } from '$lib/simulation/context.svelte';

	const simulation = getSimulation();
</script>

{#if simulation.selectedLocalisation}
	<a
		class="inline-block text-gray-500 text-base
cursor-pointer
hover:text-green-700 transform transition hover:-translate-x-1"
		data-sveltekit-noscroll
		href="ville/{simulation.selectedLocalisation.slug}"
	>
		← Toutes les aides
	</a>
{/if}
